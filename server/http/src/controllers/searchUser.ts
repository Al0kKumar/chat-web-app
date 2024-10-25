import {z} from 'zod'
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Messages from '../../../models/Message';
const prisma = new PrismaClient()


const search = async  (req: Request, res: Response) => {
    
    const  phoneNumber  = req.query.phone as string;

    try {
        const users = await prisma.user.findUnique({
            where:{phoneNumber: phoneNumber}
        }) 
    
        if(!users){
            return res.status(404).json({msg:"User not found"})
        }
    
        const lastMessage = await Messages.findOne({
            $or: [{ senderId: users.id }, { receiverId: users.id }],
          })
            .sort({ timestamp: -1 })
            .lean();
    
            const chat = {
                id: users.id,
                username: users.name,
                phoneNumber: users.phoneNumber,
                lastMessage: lastMessage
                  ? { content: lastMessage.content}
                  : { content: 'No messages', timestamp: null },
              };
    
    
        res.json(chat)
    } catch (error) {
        console.error("Error searching chats:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

// get all chats with the users
const getAllchats = async (req: Request, res: Response) => {
   
    const userid = parseInt(req.user.id);

     const users = await prisma.user.findMany({
        where: { NOT: { id: userid } },
        select: { id: true, name: true, phoneNumber: true } // Select fields you want
    });

    const chats = await Promise.all(users.map(async (user) => {
        
        const lastMessage = await Messages.findOne({
            $or: [
                { senderId: userid, receiverId: user.id },
                { senderId: user.id, receiverId: userid }
            ]
        }).sort({ createdAt: -1 });

        return {
            userid: user.id,
            userName: user.name,
            phoneNumber: user.phoneNumber,
            lastMessage: lastMessage ? lastMessage.content : null, // Add other message fields as needed
            lastMessageTime: lastMessage ? lastMessage.createdAt : null // Adjust as per your message schema
        };
    }));

    res.status(200).json(chats);


}


export { search, getAllchats };