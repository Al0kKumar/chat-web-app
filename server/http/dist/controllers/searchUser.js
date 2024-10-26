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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllchats = exports.search = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const phoneNumber = req.query.phone;
    try {
        const users = yield prisma.user.findUnique({
            where: { phoneNumber: phoneNumber }
        });
        if (!users) {
            return res.status(404).json({ msg: "User not found" });
        }
        const lastMessage = yield prisma.messages.findFirst({
            where: {
                OR: [
                    { senderid: users.id },
                    { receiverid: users.id },
                ],
            },
            orderBy: {
                timestamp: 'desc',
            },
            select: {
                content: true,
                timestamp: true, // Include timestamp if you want to access it later
            },
        });
        const chat = {
            id: users.id,
            username: users.name,
            phoneNumber: users.phoneNumber,
            lastMessage: lastMessage
                ? { content: lastMessage.content, timestamp: lastMessage.timestamp }
                : { content: 'No messages', timestamp: null },
        };
        res.json(chat);
    }
    catch (error) {
        console.error("Error searching chats:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.search = search;
// get all chats with the users
const getAllchats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = parseInt(req.user.id);
    const users = yield prisma.user.findMany({
        where: { NOT: { id: userid } },
        select: { id: true, name: true, phoneNumber: true } // Select fields you want
    });
    const chats = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        const lastMessage = yield prisma.messages.findFirst({
            where: {
                OR: [
                    { senderid: userid, receiverid: user.id },
                    { senderid: user.id, receiverid: userid },
                ],
            },
            orderBy: {
                timestamp: 'desc', // Adjust to your timestamp field
            },
            select: {
                content: true,
                timestamp: true, // Include the timestamp field
            },
        });
        return {
            userid: user.id,
            userName: user.name,
            phoneNumber: user.phoneNumber,
            lastMessage: lastMessage ? lastMessage.content : null, // Get last message content
            lastMessageTime: lastMessage ? lastMessage.timestamp : null, // Get last message timestamp
        };
    })));
    res.status(200).json(chats);
});
exports.getAllchats = getAllchats;
