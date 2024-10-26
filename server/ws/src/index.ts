import { WebSocketServer} from "ws";
import WebSocket from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";

require('dotenv').config();

const prisma = new PrismaClient()

const wss = new WebSocketServer({port: parseInt(process.env.PORT2)})

const clients = new Map();

wss.on('listening', ()=> {
   console.log(`websocket server is running on port ${process.env.PORT2}`);
})

wss.on('connection', async (ws,req) => {
   
   const url = new URL(req.url, `http://${req.headers.host}`);
   const token = url.searchParams.get('token'); 

   if(!token){
     return ws.close(400,'Token is not present')  
   }
   
   let verified: JwtPayload;

  try {
   verified = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch (error) {
   return ws.close(4001,'Invalid token')  
  }

  const senderid = verified.id;

  clients.set(senderid,ws)
   
  console.log(`WebSocket connection established for user: ${senderid}`);


   // check if the client has any unread messages 
   try {
      const unreadmsgs = await prisma.messages.findMany({where:{receiverid: senderid, isRead: false}})
      ws.send(JSON.stringify({unreadmsgs}))
   } catch (error) {
      console.error('Error fetching unread messsages: ', error);
      
   }
   
   // received a message => parsed it into json , stored it into db, if state of the reciver is open so sent to that user 
   ws.on('message', async (message: WebSocket.Data) => {

      if(typeof message === 'string'){
      
      const parsedmessage = JSON.parse(message)

      const { senderid,receiverid,content } = parsedmessage;
      
      try {
         await prisma.messages.create({
            data:{
            senderid,
            receiverid,
            content,
            }
         })
      } catch (error) {
         console.error('Error storing message:', error);
         ws.send(JSON.stringify({ error: 'Failed to send message' }));
         return;
      }
      
      // get the websocket connection id of the recipent 
      // to whom the message is to be sent
      const receiversocket = clients.get(receiverid);

      if(receiversocket){
         // send the message to the recipent 
         receiversocket.send(JSON.stringify(parsedmessage));

         await prisma.messages.updateMany({
            where:{senderid: senderid, receiverid: receiverid, isRead: false},
            data:{isRead: true}
         })
      }
     }
   })


   ws.on('close', () => {
    
    console.log('client disconnected');
    clients.delete(senderid)
    
   })

   ws.send('welcome from web socket ')

})

console.log(`websocket server started on port ${process.env.PORT2}`);
