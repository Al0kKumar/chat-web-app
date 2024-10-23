import {z} from 'zod'
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const searchSchema = z.object({
    phoneNumber:z.string()
})

const search = async  (req: Request, res: Response) => {
    
    const check = searchSchema.safeParse(req.body);

    if(!check.success){
        return res.status(401).json({msg:"Invalid input"})
    }
    
    const { phoneNumber } = req.body;

    const users = await prisma.user.findMany({
        where:{phoneNumber: phoneNumber}
    }) 

    return  res.status(201).json({users})

}

export default search;