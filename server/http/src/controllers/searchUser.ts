import {z} from 'zod'
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()


const search = async (req: Request, res: Response) => {
  const phoneQuery = String(req.query.phone || '').trim();
  const currentUserId = req.user?.id; // assumes you’re using some auth middleware

  if (!phoneQuery || !/^\+?\d+$/.test(phoneQuery)) {
    return res.status(400).json({ error: 'Invalid phone number query.' });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        phoneNumber: {
          contains: phoneQuery, // partial match (like regex-lite)
          mode: 'insensitive'
        },
        NOT: {
          id: Number(currentUserId), // Exclude current user
        }
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        // Add other fields if needed
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'An error occurred while searching for users.' });
  }
};


// // get all chats with the users/ conversations
// const getAllchats = async (req: Request, res: Response) => {
   
//     const userid = Number(req.user.id);


//     const chats = await prisma.messages.findMany({
//         where: {
//           OR: [
//             { senderid: userid},
//             { receiverid: userid }
//           ]
//         },
//         orderBy: {
//           timestamp: 'desc' // Order by latest message timestamp
//         }
//       });
  
//       // Extract unique chat partners and last message for each
//       const uniqueChats = [];
//       const seenUserIds = new Set();
  
//       for (const chat of chats) {
//         // Determine the chat partner
//         const partnerId = chat.senderid === userid ? chat.receiverid : chat.senderid;
  
//         if (!seenUserIds.has(partnerId)) {
//           const partner = await prisma.user.findUnique({
//             where: { id: partnerId },
//             select: {
//               id: true,
//               name: true,
//               phoneNumber: true,
//             }
//           });
  
//           const lastMessage = await prisma.messages.findFirst({
//             where: { 
//               OR: [
//                 { senderid: userid, receiverid: partnerId },
//                 { senderid: partnerId, receiverid: userid }
//               ]
//             },
//             orderBy: { timestamp: 'desc' },
//             select: { content: true, timestamp: true }
//           });
  
//           uniqueChats.push({
//             userid: partner.id,
//             userName: partner.name,
//             phoneNumber: partner.phoneNumber,
//             lastMessage: lastMessage.content,
//             lastMessageTime: lastMessage.timestamp
//           });
  
//           seenUserIds.add(partnerId);
//         }
//       }
  
//       res.json(uniqueChats);
// }


// get all chats with the users/ conversations
const getAllchats = async (req: Request, res: Response) => {
  const userId = Number(req.user.id);

  // Step 1: Fetch all messages where the user is either sender or receiver, ordered by latest first
  const messages = await prisma.messages.findMany({
    where: {
      OR: [
        { senderid: userId },
        { receiverid: userId }
      ]
    },
    orderBy: {
      timestamp: 'desc'
    }
  });

  // Step 2: Prepare a map to track latest message per unique partner
  const seen = new Set<number>();
  const chatSummaries = [];

  for (const msg of messages) {
    const partnerId = msg.senderid === userId ? msg.receiverid : msg.senderid;

    if (seen.has(partnerId)) continue;

    const partner = await prisma.user.findUnique({
      where: { id: partnerId },
      select: {
        id: true,
        name: true,
        phoneNumber: true
      }
    });

    chatSummaries.push({
      id: partner?.id,
      userName: partner?.name,
      phoneNumber: partner?.phoneNumber,
      lastMessage: msg.content,
      lastMessageTime: msg.timestamp
    });

    seen.add(partnerId);
  }

  res.json(chatSummaries);
};


export { search, getAllchats };