import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


// get all messages between two users 
const Chatsbetween = async (req: Request,res: Response) => {
   
  const currentuserid = typeof req.user.id === 'string' ? parseInt(req.user.id) : req.user.id;
  const recipientid = parseInt(req.query.recipientId as string);

  console.log("Current User ID:", currentuserid);
  console.log("Recipient ID:", recipientid);

    try {
      const messages = await prisma.messages.findMany({
        where: {
          OR: [
            { senderid: currentuserid, receiverid: recipientid },
            { senderid: recipientid, receiverid: currentuserid },
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
