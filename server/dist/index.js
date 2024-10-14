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
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const userauth_1 = __importDefault(require("./routes/userauth"));
const chat_1 = __importDefault(require("./routes/chat"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
require('dotenv').config();
app.use(express_1.default.json());
app.use('/api/v1', userauth_1.default);
app.use('/api/v1', chat_1.default);
const server = (0, http_1.createServer)(app);
const wss = new ws_1.WebSocketServer({ server });
let clients = new Map();
console.log("WebSocket server is created");
wss.on('connection', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('New WebSocket connection attempt');
    const params = new URLSearchParams((_a = req.url) === null || _a === void 0 ? void 0 : _a.split('?')[1]);
    const token = params.get('token');
    if (!token) {
        ws.close(4001, 'Token missing');
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        let userId = "";
        if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
            userId = decoded.id;
            ws.userId = userId;
            clients.set(userId, ws);
            ws.send(JSON.stringify({ message: "Authentication successful" }));
        }
        else {
            ws.close(4002, 'Invalid token');
            return;
        }
        const unreadMsgs = yield prisma.message.findMany({
            where: { receiverId: parseInt(userId), isRead: false },
            orderBy: { timestamp: 'asc' }
        });
        if (unreadMsgs.length > 0) {
            for (const message of unreadMsgs) {
                ws.send(JSON.stringify({
                    senderId: message.senderId,
                    content: message.content,
                    sendAt: message.timestamp
                }));
            }
        }
        yield prisma.message.updateMany({
            where: { receiverId: parseInt(userId), isRead: false },
            data: { isRead: true }
        });
    }
    catch (error) {
        console.error('Token verification failed:', error.message);
        ws.close(4002, 'Invalid token');
        return;
    }
    ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        const parsedMessage = JSON.parse(message);
        const recipientId = parsedMessage.recipientId;
        const messageText = parsedMessage.message;
        const recipientWs = clients.get(recipientId);
        const recipient = yield prisma.user.findUnique({
            where: { id: parseInt(recipientId) },
        });
        if (!recipient) {
            throw new Error(`Recipient with ID ${recipientId} does not exist`);
        }
        try {
            // Save the message to the database
            yield prisma.message.create({
                data: {
                    content: messageText,
                    senderId: parseInt(ws.userId),
                    receiverId: parseInt(recipientId),
                    isRead: false // Mark as read if the recipient is online
                }
            });
            console.log('Sending message to recipient');
            // If the recipient is online, send the message directly
            if (recipientWs && recipientWs.readyState == ws_1.WebSocket.OPEN) {
                console.log('Sending message to recipient');
                recipientWs.send(JSON.stringify({
                    senderId: ws.userId,
                    content: messageText
                }));
            }
        }
        catch (error) {
            console.error('Prisma message creation error:', error.message);
        }
    }));
    ws.send(JSON.stringify({ message: "welcome" }));
    ws.on('close', (code, reason) => {
        console.log(`WebSocket closed. Code: ${code}, Reason: ${reason.toString()}`);
        clients.delete(ws.userId);
    });
    ws.on('error', (error) => {
        console.error('websocket error', error.message);
    });
}));
server.listen(8080, () => {
    console.log("server is running on port 8080");
});
