import express from 'express';
import { WebSocketServer, WebSocket } from 'ws'
import http, { createServer } from 'http'
import cors from 'cors';
import userauthroutes from './routes/userauth'
import chatroutes from './routes/chat'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const app = express();

app.use(cors());

require('dotenv').config();

app.use(express.json());

interface AuthenticatedWebSocket extends WebSocket {
    userId?: string;
}

app.use('/api/v1',userauthroutes);
app.use('/api/v1',chatroutes);

const server = createServer(app);
const wss = new WebSocketServer({server});
let clients = new Map<string,AuthenticatedWebSocket>();


console.log("WebSocket server is created");


// a user is connected to the web socket server 
wss.on('connection',async (ws: AuthenticatedWebSocket,req) => {

    console.log('New WebSocket connection attempt');

    const params = new URLSearchParams(req.url?.split('?')[1]);
    const token = params.get('token');

if (!token) {
    ws.close(4001, 'Token missing');
    return;
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
     let userId = ""
    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
        userId = decoded.id as string;
        ws.userId = userId;
        clients.set(userId, ws);
        ws.send(JSON.stringify({ message: "Authentication successful" }));
    } else {
        ws.close(4002, 'Invalid token');
        return;
    }

    const unreadMsgs = await prisma.message.findMany({
        where:{receiverId: parseInt(userId),isRead:false},
        orderBy:{timestamp: 'asc'}
      });

      if(unreadMsgs.length > 0){
        for(const message of unreadMsgs){
            ws.send(JSON.stringify({
                senderId: message.senderId,
                content: message.content,
                sendAt:message.timestamp
            }))
        }
      }

      await prisma.message.updateMany({
        where:{receiverId:parseInt(userId),isRead:false},
        data:{isRead: true}
      })
      
} catch (error) {
    console.error('Token verification failed:', error.message);
    ws.close(4002, 'Invalid token');
    return;
}

  
// server receives the message form the client &&
// and now its handles the message to send to the recipent back form the \
// web socket connections 
ws.on('message', async (message: string) => {
    const parsedMessage = JSON.parse(message);
    const recipientId = parsedMessage.recipientId;
    const messageText = parsedMessage.message;

    const recipientWs = clients.get(recipientId);

    if(!messageText){
        return ws.close(4002,'Empty message');
    }

    const recipient = await prisma.user.findUnique({
        where: { id: parseInt(recipientId) },
      });
      
      if (!recipient) {
        throw new Error(`Recipient with ID ${recipientId} does not exist`);
      }

    try {
        // Save the message to the database
        await prisma.message.create({
            data: {
                content: messageText,
                senderId: parseInt(ws.userId as string),
                receiverId: parseInt(recipientId),
                isRead: false // Mark as read if the recipient is online
            }
        });

        console.log('Sending message to recipient');

        // If the recipient is online, send the message directly
        if (recipientWs && recipientWs.readyState == WebSocket.OPEN) {
            console.log('Sending message to recipient');
            recipientWs.send(JSON.stringify({
                senderId: ws.userId,
                content: messageText
            }));
            
            // updating the message status in db if the user is online 
            await prisma.message.updateMany({
                where:{senderId:parseInt(ws.userId),receiverId:parseInt(recipientId),isRead:false},
                data:{isRead:true}
            })
        }

    } catch (error) {
        console.error('Prisma message creation error:', error.message);
    }
});
   
     ws.send(JSON.stringify({message:"welcome"}))

    ws.on('close', (code,reason) => {
        console.log(`WebSocket closed. Code: ${code}, Reason: ${reason.toString()}`);
        clients.delete(ws.userId)
        
    })
    ws.on('error', (error)=> {
        console.error('websocket error',error.message);        
    })


})

server.listen(8080, () => {
    console.log("server is running on port 8080");
     
})