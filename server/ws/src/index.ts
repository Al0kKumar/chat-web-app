import { WebSocketServer,WebSocket } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config();


const prisma = new PrismaClient();
const wss = new WebSocketServer({ port: parseInt(process.env.PORT2) });
const clients = new Map<number, WebSocket>();

wss.on('listening', () => {
    console.log(`WebSocket server is running on port ${process.env.PORT2}`);
});
    




wss.on('connection', async (ws, req) => {


    const urlParams = new URLSearchParams(req.url?.split('?')[1]);
    const token = urlParams.get('token');

    if (!token) {
        console.error('Connection attempt without token');
        return ws.close(1008, 'Token is not present');
    }

    
    let verified: JwtPayload;
    try {
        verified = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    } catch (error) {
        console.error('Invalid token:', error);
        return ws.close(1008, 'Invalid token');
    }

    console.log('connection established ');

    const senderid = verified.id as number;

    const existingSocket = clients.get(senderid);

    if (existingSocket) {
       console.log(`Closing existing connection for user: ${senderid}`);
       existingSocket.terminate()
    }
    
    clients.set(senderid, ws);
    console.log(`WebSocket connection established for user: ${senderid}`);

    // Send initial welcome message
    ws.send(JSON.stringify({ message: 'Welcome from WebSocket server' }));

    try {
        const unreadMsgs = await prisma.messages.findMany({ where: { receiverid: senderid, isRead: false } });

        if(unreadMsgs.length > 0){
            ws.send(JSON.stringify({unreadMsgs}))
        }

    } catch (error) {
        console.error('Error fetching unread messages:', error);
    }

    

    // Handle incoming messages
    console.log('message on the way to be received');
    
    ws.on('message', async (data) => {

        console.log(`message recived  from client `,data.toString());
        
        
            try {
                const parsedMessage = JSON.parse(data.toString());
    
                const { senderid, receiverid, content } = parsedMessage;
    
                if(!senderid || !receiverid || !content)  return; 
                
                const receiverSocket = clients.get(receiverid);
                if(receiverSocket){
                    receiverSocket.send(JSON.stringify({...parsedMessage}))
                }
    
                    await prisma.messages.create({
                        data: {
                            senderid,
                            receiverid,
                            content
                        },
                    });
                      console.log('message saved to database');
            } catch (error) {
                console.error('Error processing message:', error);
                ws.send(JSON.stringify({ error: 'Failed to process message' }));
            }
                  
            
    });

    // Handle disconnection
    ws.on('close', (code,reason) => {
        console.log(`Client ${senderid} disconnected with : ${code}, reason: ${reason}`);
        clients.delete(senderid);
    });

    const keepAliveInterval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            ws.ping();
        } else {
            clearInterval(keepAliveInterval);
        }
    }, 30000);
});
