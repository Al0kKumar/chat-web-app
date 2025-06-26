import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {z} from 'zod';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getotp, sendotp } from "../services/email";
import auth from "../middlewares/authmiddleware";
import axios from "axios"

const prisma = new PrismaClient()


const userSchema = z.object({
    name : z.string().min(3,"Name must be at least 3 characters long"),
    email : z.string().min(2, "email must be at least 3 characters long"),
    phoneNumber: z.string().min(5, "phonenumber must be at least 3 characters long"),
    password:z.string().min(2, "password must be at least 2 characters long")
})  


const Signup = async  (req: Request, res: Response) => {

    const check = userSchema.safeParse(req.body);

    if(!check.success){
        return res.status(401).json({
            msg:"wrong inputs"
        })
    }

    const { name , email ,password , phoneNumber} = check.data;

    const userexists = await prisma.user.findUnique({
        where:{email: email}
    })

    if(userexists){
        return res.status(409).json({
            msg:"user already exists with this email "
        })
    }

    const existingUser = await prisma.user.findUnique({
       where: { phoneNumber },
    });

        if (existingUser) {
        return res.status(409).json({ msg: 'Phone number already registered' });
        }

    const hashedpassword = await bcrypt.hash(password,10);

    const otp = getotp();
    const creationtime = new Date();

    const user = await prisma.user.create({
        data:{
            name,
            email,
            phoneNumber,
            password: hashedpassword,
            otp: otp,
            otpCreatedat: creationtime
        }
    })

    sendotp(email,otp);

    if(!user){
        return res.status(404).json({
            msg:"something went wrong with us"
        })
    }

    return res.status(200).json({
        msg:"Sent OTP for verification"
    })


}


const verifyOTPSchema = z.object({
    email: z.string(),
    otp:z.string()
})


export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = getotp();

  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otpCreatedat: new Date(),
    },
  });

  await sendotp(email, otp);

  return res.json({ message: "OTP resent successfully" });
};



export const googleAuth = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ message: "Access token missing" });

  try {
    const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { email, name } = googleRes.data;

    if (!email) return res.status(400).json({ message: "Invalid Google token" });

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {

      const otp = getotp();
    const creationtime = new Date();

    const user = await prisma.user.create({
        data:{
            name,
            email,
            phoneNumber:"",
            password: "",
            otp: otp,
            otpCreatedat: creationtime
        }
    })

    sendotp(email,otp);


      const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: "7d"
      });

      return res.json({
        status: "new",
        user,
        token: jwtToken,
      });
    }

    // If user exists:
    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "7d"
    });

    if (user.phoneNumber) {
      // Existing user with phone — fully registered
      return res.json({
        status: "existing",
        user,
        token: jwtToken,
      });
    } else {
      // Exists, but incomplete profile (no phone)
      return res.json({
        status: "incomplete",
        user,
        token: jwtToken,
      });
    }

  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Google login failed" });
  }
};



const verifyOTP = async (req: Request, res: Response) => {
    
    const check  = verifyOTPSchema.safeParse(req.body);

    if(!check.success){
        return res.status(401).json({msg:"Incorrect input "})
    }
     
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({
        where:{email:email}
    })

    if(!user){
        return res.status(401).json({msg:"User not found"})
    }

    const creationtime = user.otpCreatedat;
    const timeLimit = 10 * 60 * 1000;
    const currentTime = new Date();

    if(!creationtime || currentTime.getTime() - creationtime.getTime() > timeLimit){
        return res.status(401).json({msg:"OTP expired"})
    }

    if(user.otp !== otp ){
        return res.status(401).json({msg:"Incorrect OTP"})
    }

    await prisma.user.update({
        where: { email: email },
        data: { otp: null ,otpCreatedat:null}, 
    });

    const token = jwt.sign({id: user.id},process.env.JWT_SECRET_KEY )


    return res.status(200).json({token})
    
}


export const completeGoogleProfile = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  if (!email || !phoneNumber) {
    return res.status(400).json({ message: "Email and phone number are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });

  const phoneExists = await prisma.user.findFirst({
    where: {
      phoneNumber,
      NOT: { email },
    },
  });

  if (phoneExists) return res.status(400).json({ message: "Phone already in use" });

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { phoneNumber },
  });

  return res.json({ message: "Profile updated", user: updatedUser });
};

const loginSchema = z.object({
    email:z.string().min(4, "email must be at least 3 characters long"),
    password:z.string().min(3, "password must be at least 3 characters long")
})

const Login = async (req: Request, res: Response) => {
    
    const check = loginSchema.safeParse(req.body);

    if(!check.success){
        return res.status(401).json({
            msg:"invalid inputs"
        })
    }

    const { email,password } = check.data;

    const checkuser = await prisma.user.findUnique({
        where:{email:email}
    })

    if(!checkuser){
        return res.status(400).json({msg:"user doesn't exists"})
    }

    
    const isPasswordValid = await bcrypt.compare(password, checkuser.password);

    if(!isPasswordValid){
        return res.status(404).json({msg:"wrong password"})
    }

    const token = jwt.sign({id: checkuser.id},process.env.JWT_SECRET_KEY )


    return res.status(200).json({token})
}


const userDetails = async (req: Request, res: Response) => {

    const userid = req.user.id as number;

    const user = await prisma.user.findUnique({
        where:{id: userid }
    })

    if(!user){
        return res.status(401).json({msg:"user not found"})
    }
    return res.status(200).json(user)
}

const recipentdetails = async (req: Request,res: Response) => {
   
    try {
        const userId = req.query.userId;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ msg: 'Invalid userId' });
        }

        const Id = Number(userId);

        if (isNaN(Id)) {
            return res.status(400).json({ msg: 'Invalid userId format' });
        }

        const details = await prisma.user.findUnique({
            where: {
                id: Id, 
            },
        });

        if (!details) {
            return res.status(404).json({ msg: 'No user found' });
        }

    
    
        return res.status(200).json(details)
    } catch (error) {
        console.log('invalid token / unauthorised', error);
        
    }
} 


export  { Signup, Login, verifyOTP, recipentdetails, userDetails }