import {z} from 'zod'
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
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
    
        const lastMessage = await prisma.messages.findFirst({
            where: {
              OR: [
                { senderid: users.id },
                { receiverid: users.id },
              ],
            },
            orderBy: {
              timestamp: 'desc',
            },
            select: {
              content: true,
              timestamp: true, // Include timestamp if you want to access it later
            },
          });
          
          const chat = {
            id: users.id,
            username: users.name,
            phoneNumber: users.phoneNumber,
            lastMessage: lastMessage
              ? { content: lastMessage.content, timestamp: lastMessage.timestamp }
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
        const lastMessage = await prisma.messages.findFirst({
            where: {
                OR: [
                    { senderid: userid, receiverid: user.id },
                    { senderid: user.id, receiverid: userid },
                ],
            },
            orderBy: {
                timestamp: 'desc', // Adjust to your timestamp field
            },
            select: {
                content: true,
                timestamp: true, // Include the timestamp field
            },
        });
    
        return {
            userid: user.id,
            userName: user.name,
            phoneNumber: user.phoneNumber,
            lastMessage: lastMessage ? lastMessage.content : null, // Get last message content
            lastMessageTime: lastMessage ? lastMessage.timestamp: null, // Get last message timestamp
        };
    }));
    

    res.status(200).json(chats);


}


export { search, getAllchats };