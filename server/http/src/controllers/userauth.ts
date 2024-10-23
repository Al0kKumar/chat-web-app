import { Express, Request, RequestHandler, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {z} from 'zod';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getotp, sendotp } from "../services/email";

const prisma = new PrismaClient()


const userSchema = z.object({
    name : z.string(),
    email : z.string(),
    phoneNumber: z.string(),
    password:z.string()
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
            isOnline:false,
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

    return res.status(200).json({msg:"User Verfied and created  successfully"})
    
}

const loginSchema = z.object({
    email:z.string(),
    password:z.string()
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
        return res.status(401).json({msg:"wrong password"})
    }

    const token = jwt.sign({id: checkuser.id},process.env.JWT_SECRET_KEY )


    return res.status(200).json({token})
}


export  { Signup, Login, verifyOTP }