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

    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
        const userId = decoded.id as string;
        ws.userId = userId;
        clients.set(userId, ws);
        ws.send(JSON.stringify({ message: "Authentication successful" }));
    } else {
        ws.close(4002, 'Invalid token');
        return;
    }
} catch (error) {
    console.error('Token verification failed:', error.message);
    ws.close(4002, 'Invalid token');
    return;
}

ws.on('message', async (message: string) => {
    const parsedMessage = JSON.parse(message);
    const recipientId = parseInt(parsedMessage.recipientId);
    const messageText = parsedMessage.message;

    const recipientWs = clients.get(recipientId.toString());

    try {
        // Save the message to the database
        await prisma.message.create({
            data: {
                content: messageText,
                senderId: parseInt(ws.userId as string),
                receiverId: recipientId,
                isRead: !!recipientWs // Mark as read if the recipient is online
            }
        });

        // If the recipient is online, send the message directly
        if (recipientWs) {
            recipientWs.send(JSON.stringify({
                senderId: ws.userId,
                content: messageText
            }));
        }

    } catch (error) {
        console.error('Prisma message creation error:', error.message);
    }
});
   

//     const params = new URLSearchParams(req.url?.split('?')[1]);
//     const token = params.get('token');
//    // console.log('token',token);
    

//     if(!token){
//         ws.close(4001, 'Token missing');
//         return ;
//     }

//     try {
//         const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        
//         if(typeof decoded === 'object' && decoded !== null && 'userId' in decoded){
//             const userId = decoded.userId as string;
            
//             ws.userId = userId;
            
//             clients.set(userId,ws);
    
//             try {
//                 const unreadMsgs = await prisma.message.findMany({
//                     where:{
//                         receiverId : parseInt(userId),
//                         isRead: false
//                     },
//                     include:{
//                         sender:true
//                     }
//                 })
               
//                 if(unreadMsgs){
//                 unreadMsgs.forEach(msg => {
//                     ws.send(JSON.stringify({
//                         senderId: msg.senderId,
//                         content: msg.content,
//                         timeStamp: msg.timestamp
//                     }))
//                 })
//             }
        
//                 await prisma.message.updateMany({
//                     where:{
//                         receiverId: parseInt(userId),
//                         isRead:false
//                     },
//                     data:{
//                         isRead: true
//                     }
//                 })
//             } catch (error) {
//                 console.error('Prisma query error:', error.message);
//                 ws.close(1011,'Server error during db query');
                
//             }
    
        
//         }else{
//             ws.close(4002,'Invalid token');
//             return;
//         }
//     } catch (error) {
//         console.error('Token verifiaction failed:',error.message);
//         ws.close(4002,'Inavlid token');
//     }

//      ws.on('message',async (message: string) => {
//         const parsedmessage = JSON.parse(message);
//         const recipientId = parseInt(parsedmessage.recipientId);
//         const messageText = parsedmessage.message;

//         const recipientWs = clients.get(recipientId.toString())

//         if(recipientWs){

//             await prisma.message.create({
//                 data:{
//                     content:messageText,
//                     senderId: parseInt(ws.userId as string) ,
//                     receiverId:recipientId,
//                     isRead:true
//                 }
//             })

//             recipientWs.send(JSON.stringify({
//                 senderId: ws.userId,
//                 content: messageText,
//             }))
//         }
//         else{
            
//             await prisma.message.create({
//                 data:{
//                     senderId: parseInt(ws.userId as string),
//                     receiverId:  recipientId,
//                     content: messageText,
//                     isRead: false
//                 }
//             })
            
//         }

//     })


     ws.send(JSON.stringify({message:"welcome"}))

    ws.on('close', (code,reason) => {
        console.log(`WebSocket closed. Code: ${code}, Reason: ${reason.toString()}`);
        clients.delete(ws.userId)
        // if(ws.userId){
        // console.log(`User disconnected `,code,reason);
        // clients.delete(ws.userId);
        // }
    })
    ws.on('error', (error)=> {
        console.error('websocket error',error.message);        
    })


})

server.listen(8080, () => {
    console.log("server is running on port 8080");
     
})