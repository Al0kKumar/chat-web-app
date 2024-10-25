import { Request, Response } from 'express'
import Messages from '../../../models/Message'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const Chatsbetween = async (req: Request,res: Response) => {
   
    const currentuserid = req.user.id
    const otheruserid = parseInt(req.params.chatId)

    try {
        const messages = await Messages.find({
            $or: [
              { senderId: currentuserid, receiverId: otheruserid },
              { senderId: otheruserid, receiverId: currentuserid },
            ],
          })
            .sort({ timestamp: 1 }) // Sort messages in chronological order
            .lean();
        
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}


export default Chatsbetween
