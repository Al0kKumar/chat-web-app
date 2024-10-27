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
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(`${process.env.JWT_SECRET_KEY}`);
const prisma = new client_1.PrismaClient();
const wss = new ws_1.WebSocketServer({ port: parseInt(process.env.PORT2) });
const clients = new Map();
wss.on('listening', () => {
    console.log(`WebSocket server is running on port ${process.env.PORT2}`);
});
console.log('WebSocket Server Port:', process.env.PORT2);
console.log('JWT Secret:', process.env.JWT_SECRET_KEY);
wss.on('connection', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const urlParams = new URLSearchParams((_a = req.url) === null || _a === void 0 ? void 0 : _a.split('?')[1]);
    const token = urlParams.get('token');
    if (!token) {
        console.error('Connection attempt without token');
        return ws.close(1008, 'Token is not present');
    }
    let verified;
    try {
        verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    }
    catch (error) {
        console.error('Invalid token:', error);
        return ws.close(1008, 'Invalid token');
    }
    console.log('token is right ');
    const senderid = verified.id;
    const existingSocket = clients.get(senderid);
    if (existingSocket) {
        console.log(`Closing existing connection for user: ${senderid}`);
        existingSocket.terminate();
    }
    clients.set(senderid, ws);
    console.log(`WebSocket connection established for user: ${senderid}`);
    // Send initial welcome message
    ws.send(JSON.stringify({ message: 'Welcome from WebSocket server' }));
    // Fetch and send unread messages
    // try {
    //     const unreadMsgs = await prisma.messages.findMany({ where: { receiverid: senderid, isRead: false } });
    //     ws.send(JSON.stringify({ unreadMsgs }));
    // } catch (error) {
    //     console.error('Error fetching unread messages:', error);
    // }
    // Handle incoming messages
    ws.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`message recived  from`, data.toString());
        try {
            const parsedMessage = JSON.parse(data.toString());
            const { senderid, receiverid, content } = parsedMessage;
            if (!senderid || !receiverid || !content)
                return;
            const receiverSocket = clients.get(receiverid);
            if (receiverSocket) {
                receiverSocket.send(JSON.stringify(Object.assign({}, parsedMessage)));
            }
            yield prisma.messages.create({
                data: {
                    senderid,
                    receiverid,
                    content
                },
            });
            console.log('message saved to database');
        }
        catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ error: 'Failed to process message' }));
        }
    }));
    // Handle disconnection
    ws.on('close', (code, reason) => {
        console.log(`Client ${senderid} disconnected with : ${code}, reason: ${reason}`);
        clients.delete(senderid);
    });
}));
