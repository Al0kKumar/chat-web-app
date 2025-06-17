import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {z} from 'zod';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getotp, sendotp } from "../services/email";
import auth from "../middlewares/authmiddleware";

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
        return res.status(400).json({
            msg:"user already exists with this email "
        })
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
    OTP:z.string()
})

const verifyOTP = async (req: Request, res: Response) => {
    
    const check  = verifyOTPSchema.safeParse(req.body);

    if(!check.success){
        return res.status(401).json({msg:"Incorrect input "})
    }
     
    const { email, OTP } = req.body;

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

    if(user.otp !== OTP ){
        return res.status(401).json({msg:"Incorrect OTP"})
    }

    await prisma.user.update({
        where: { email: email },
        data: { otp: null ,otpCreatedat:null}, 
    });

    const token = jwt.sign({id: user.id},process.env.JWT_SECRET_KEY )


    return res.status(200).json({token})
    
}

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