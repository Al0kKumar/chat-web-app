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
const userauth_1 = __importDefault(require("./routes/userauth"));
const chat_1 = __importDefault(require("./routes/chat"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
require('dotenv').config();
app.use(express_1.default.json());
app.use('/api/v1', userauth_1.default);
app.use('/api/v1', chat_1.default);
const server = (0, http_1.createServer)(app);
const wss = new ws_1.WebSocketServer({ server });
let clients = new Map();
wss.on('connection', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const params = new URLSearchParams((_a = req.url) === null || _a === void 0 ? void 0 : _a.split('?')[1]);
    const token = params.get('token');
    if (!token) {
        ws.close(4001, 'Token missing');
        return;
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
        const userId = decoded.userId;
        ws.userId = userId;
        clients.set(userId, ws);
        const unreadMsgs = yield prisma.message.findMany({
            where: {
                receiverId: parseInt(userId),
                isRead: false
            },
            include: {
                sender: true
            }
        });
        if (unreadMsgs) {
            unreadMsgs.forEach(msg => {
                ws.send(JSON.stringify({
                    senderId: msg.senderId,
                    content: msg.content,
                    timeStamp: msg.timestamp
                }));
            });
        }
        yield prisma.message.updateMany({
            where: {
                receiverId: parseInt(userId),
                isRead: false
            },
            data: {
                isRead: true
            }
        });
    }
    else {
        ws.close(4002, 'Invalid token');
        return;
    }
    ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        const parsedmessage = JSON.parse(message);
        const recipientId = parseInt(parsedmessage.recipientId);
        const messageText = parsedmessage.message;
        const recipientWs = clients.get(recipientId.toString());
        if (recipientWs) {
            yield prisma.message.create({
                data: {
                    content: messageText,
                    senderId: parseInt(ws.userId),
                    receiverId: recipientId,
                    isRead: true
                }
            });
            recipientWs.send(JSON.stringify({
                senderId: ws.userId,
                content: messageText,
            }));
        }
        else {
            yield prisma.message.create({
                data: {
                    senderId: parseInt(ws.userId),
                    receiverId: recipientId,
                    content: messageText,
                    isRead: false
                }
            });
        }
    }));
    ws.on('close', () => {
        if (ws.userId) {
            console.log(`User disconnected ${ws.userId}`);
            clients.delete(ws.userId);
        }
    });
}));
app.listen(3000, () => {
    console.log("server is running on port 3000");
});
