"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Message_1 = __importDefault(require("@models/Message"));
const dbconnect_1 = __importDefault(require("./dbconnect"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
const clients = new Map();
(0, dbconnect_1.default)();
wss.on('listening', () => {
    console.log('websocket server is running on port 8080');
});
wss.on('connection', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    if (!token) {
        return ws.close(400, 'Token is not present');
    }
    let verified;
    try {
        verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        return ws.close(4001, 'Invalid token');
    }
    const senderid = verified.id;
    clients.set(senderid, ws);
    console.log(`WebSocket connection established for user: ${senderid}`);
    // check if the client has any unread messages 
    try {
        const unreadmsgs = yield Message_1.default.find({ receiverid: senderid, isRead: false });
        ws.send(JSON.stringify({ unreadmsgs }));
    }
    catch (error) {
        console.error('Error fetching unread messsages: ', error);
    }
    // received a message => parsed it into json , stored it into mongodb, if state of the reciver is open so sent to that user 
    ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        if (typeof message === 'string') {
            const parsedmessage = JSON.parse(message);
            const { senderid, receiverid, content } = parsedmessage;
            try {
                yield Message_1.default.create({
                    senderid,
                    receiverid,
                    content,
                    isRead: false
                });
            }
            catch (error) {
                console.error('Error storing message:', error);
                ws.send(JSON.stringify({ error: 'Failed to send message' }));
                return;
            }
            // get the websocket connection id of the recipent 
            // to whom the message is to be sent
            const receiversocket = clients.get(receiverid);
            if (receiversocket) {
                // send the message to the recipent 
                receiversocket.send(JSON.stringify(parsedmessage));
                yield Message_1.default.updateMany({ senderid: senderid, receiverid: receiverid, isRead: false }, { $set: { isRead: true } });
            }
        }
    }));
    ws.on('close', () => {
        console.log('client disconnected');
        clients.delete(senderid);
    });
    ws.send('welcome from web socket ');
}));
console.log('websocket server started on port 8080');
