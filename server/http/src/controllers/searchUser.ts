import {z} from 'zod'
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()


// bro make in regex to work smoothly
const search = async  (req: Request, res: Response) => {
    
    const  phoneNumber  = String(req.query.phone);

    try {
        // Find all users matching the search term, excluding the current user
        const users = await prisma.user.findMany({
          where: {phoneNumber: phoneNumber},
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
          orderBy: {
            name: 'asc' // Sort results by name for easy searching
          }
        });
    
        res.json(users);
      } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'An error occurred while searching for users.' });
      }

}

// get all chats with the users/ conversations
const getAllchats = async (req: Request, res: Response) => {
   
    const userid = Number(req.user.id);


    const chats = await prisma.messages.findMany({
        where: {
          OR: [
            { senderid: userid},
            { receiverid: userid }
          ]
        },
        orderBy: {
          timestamp: 'desc' // Order by latest message timestamp
        }
      });
  
      // Extract unique chat partners and last message for each
      const uniqueChats = [];
      const seenUserIds = new Set();
  
      for (const chat of chats) {
        // Determine the chat partner
        const partnerId = chat.senderid === userid ? chat.receiverid : chat.senderid;
  
        if (!seenUserIds.has(partnerId)) {
          const partner = await prisma.user.findUnique({
            where: { id: partnerId },
            select: {
              id: true,
              name: true,
              phoneNumber: true,
            }
          });
  
          const lastMessage = await prisma.messages.findFirst({
            where: { 
              OR: [
                { senderid: userid, receiverid: partnerId },
                { senderid: partnerId, receiverid: userid }
              ]
            },
            orderBy: { timestamp: 'desc' },
            select: { content: true, timestamp: true }
          });
  
          uniqueChats.push({
            userid: partner.id,
            userName: partner.name,
            phoneNumber: partner.phoneNumber,
            lastMessage: lastMessage.content,
            lastMessageTime: lastMessage.timestamp
          });
  
          seenUserIds.add(partnerId);
        }
      }
  
      res.json(uniqueChats);
}


export { search, getAllchats };