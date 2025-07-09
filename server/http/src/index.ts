import http from "http";
import express from 'express';
import cors from 'cors'
import chatroutes from './routes/chatRoute'
import searchroutes from './routes/searchRoute'
import userauthRoutes from './routes/userauthRoutes'; // Make sure this path is correct
import { WebSocketServer,WebSocket } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';


const app = express();
const prisma = new PrismaClient();

const allowedOrigins = [
  'http://localhost:8080',
  'https://chat-web-app-sigma.vercel.app',
  // Add any other origins that need to access your backend
];

// Configure CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow these methods
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"], // Explicitly allow these headers
}));


app.use(express.json());


app.use('/api/v1',userauthRoutes); // done 
app.use('/api/v1',chatroutes);
app.use('/api/v1', searchroutes)


dotenv.config();

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const clients = new Map<number, WebSocket>();

wss.on('listening', () => {
    console.log(`WebSocket server is running on port ${process.env.PORT}`);
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

    if (!senderid) throw new Error("Missing ID in token");

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

            await prisma.messages.updateMany({
                where:{receiverid: senderid,isRead: false},
                data:{isRead: true}
            })
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
    
                const { receiverid, content } = parsedMessage;
    
                if (!receiverid || !content || typeof content !== "string") {
                    console.warn("⚠️ Invalid message format:", parsedMessage);
                    return;
                }
                
                const receiverSocket = clients.get(receiverid);
                if(receiverSocket){
                    receiverSocket.send(JSON.stringify({...parsedMessage}))
                }
    
                    await prisma.messages.create({
                        data: {
                            senderid,
                            receiverid,
                            content,
                            isRead: false
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



server.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
     
})