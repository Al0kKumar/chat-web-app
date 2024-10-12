import express from 'express';
import { WebSocketServer, WebSocket } from 'ws'
import http, { createServer } from 'http'
import userauthroutes from './routes/userauth'
import chatroutes from './routes/chat'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { timeStamp } from 'console';

const prisma = new PrismaClient()

const app = express();

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


wss.on('connection',async (ws: AuthenticatedWebSocket,req) => {

    const params = new URLSearchParams(req.url?.split('?')[1]);
    const token = params.get('token');

    if(!token){
        ws.close(4001, 'Token missing');
        return ;
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET as string);
    
    if(typeof decoded === 'object' && decoded !== null && 'userId' in decoded){
        const userId = decoded.userId as string;
        
        ws.userId = userId;
        
        clients.set(userId,ws);

        const unreadMsgs = await prisma.message.findMany({
            where:{
                recipientId : userId,
                isRead: false
            },
            include:{
                sender:true
            }
        })

        unreadMsgs.forEach(msg => {
            ws.send(JSON.stringify({
                senderId: msg.senderId,
                content: msg.content,
                timeStamp: msg.timestamp
            }))
        })

        await prisma.message.updateMany({
            where:{
                recipientId: userId,
                isRead:false
            },
            data:{
                isRead: true
            }
        })

    
    }else{
        ws.close(4002,'Invalid token');
        return;
    }

     ws.on('message',async (message: string) => {
        const parsedmessage = JSON.parse(message);
        const recipentId = parsedmessage.recipentId;
        const messageText = parsedmessage.message;

        const recipentWs = clients.get(recipentId)

        if(recipentWs){

            recipentWs.send(JSON.stringify({
                senderId: ws.userId,
                content: messageText,
                timeStamp: new Date()
            }))
        }
        else{
            
            await prisma.message.create({
                data:{
                    chatId:1,
                    senderId:ws.userId,
                    content: messageText
                }
            })
            
        }

    })

    ws.on('close', () => {
        if(ws.userId){
        console.log(`User disconnected ${ws.userId}`);
        clients.delete(ws.userId);
        }
        
    })


})

app.listen(3000, () => {
    console.log("server is running on port 3000");
     
})