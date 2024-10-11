import { Request, Response, Router } from "express";
import { z } from 'zod';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const router = Router();

const secret = 'secret';




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

    const userexists = await prisma.User.findOne({
        where:[phoneNumber:phoneNumber]
    })

    if(userexists){
        return res.status(400).json({
            msg:"user already exists with this number "
        })
    }

    const hashedpasssword = bcrypt.hash(password,10);

    const user = await prisma.User.create({
        data:{
            name,
            phoneNumber,
            password: hashedpasssword
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

    const checkuser = await prisma.User.findUnique({
        where:{phoneNumber:phoneNumber}
    })

    if(!checkuser){
        return res.status(400).json({msg:"user doesn't exists"})
    }

    
    const isPasswordValid = await bcrypt.compare(password, checkuser.password);

    if(!isPasswordValid){
        return res.status(401).json({msg:"wrong password"})
    }

    const token = jwt.sign(checkuser,secret,{expiresIn: '1h'})


    return res.status(200).json(token)

})


export default router ;