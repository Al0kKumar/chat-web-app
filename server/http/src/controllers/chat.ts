import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const Chatsbetween = async (req: Request,res: Response) => {
   
    const currentuserid = parseInt(req.user.id)
    const otheruserid = parseInt(req.params.chatId)

    try {
      const messages = await prisma.messages.findMany({
        where: {
          OR: [
            { senderid: currentuserid, receiverid: otheruserid },
            { senderid: otheruserid, receiverid: currentuserid },
          ],
        },
        orderBy: {
          timestamp: 'asc', // Sort messages in chronological order
        },
      });
        
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}


export default Chatsbetween
