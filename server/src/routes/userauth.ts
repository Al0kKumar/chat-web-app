import { Request, Response, Router } from "express";
import { z } from 'zod';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const router = Router();
import { PrismaClient } from "@prisma/client";
import auth from "./authmiddleware";


const prisma = new PrismaClient();


const userSchema = z.object({
    name : z.string(),
    phoneNumber : z.string(),
    password:z.string()
})  

router.post('/signup', async(req: Request, res: Response)=>{
    
    const check = userSchema.safeParse(req.body);

    if(!check.success){
        return res.status(401).json({
            msg:"wrong inputs"
        })
    }

    const { name , phoneNumber ,password } = check.data;

    const userexists = await prisma.user.findUnique({
        where:{phoneNumber:phoneNumber}
    })

    if(userexists){
        return res.status(400).json({
            msg:"user already exists with this number "
        })
    }

    const hashedpassword = await bcrypt.hash(password,10);

    const user = await prisma.user.create({
        data:{
          name ,
          phoneNumber,
          password: hashedpassword 
        }
    })

    if(!user){
        return res.status(404).json({
            msg:"something went wrong with us"
        })
    }

    return res.status(201).json({
        msg:"user created successfully"
    })

})

const loginSchema = z.object({
    phoneNumber:z.string(),
    password:z.string()
})

router.post('/login',async(req,res) => {
    const check = loginSchema.safeParse(req.body);

    if(!check.success){
        return res.status(401).json({
            msg:"invalid inputs"
        })
    }

    const { phoneNumber,password } = check.data;

    const checkuser = await prisma.user.findUnique({
        where:{phoneNumber:phoneNumber}
    })

    if(!checkuser){
        return res.status(400).json({msg:"user doesn't exists"})
    }

    
    const isPasswordValid = await bcrypt.compare(password, checkuser.password);

    if(!isPasswordValid){
        return res.status(401).json({msg:"wrong password"})
    }

    const token = jwt.sign(checkuser,process.env.JWT_SECRET as string,{expiresIn: '1h'})


    return res.status(200).json({token})

})


const searchuserSchema = z.object({
    phoneNumber :z.string()
}) 

router.get('/search', auth ,async (req,res) => {

    const {phoneNumber} = req.query
     
    const check = searchuserSchema.safeParse({phoneNumber});

    if(!check.success){
        return res.status(401).json({msg:"Invalid input"})
    }

    try {
        const users = await prisma.user.findMany({
            where:{
                phoneNumber:phoneNumber as string
            }
        });
    
        if(users.length === 0){
            return res.status(404).json({msg:"No users found with that phone number"})
        }
    
        return res.status(201).json(users)

    } catch (error) {
        console.log("error fetching users ",error);
        return res.status(500).json({msg:"Internal server error"})
        
    }

})
           
export default router ;