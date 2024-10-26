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
exports.getAllchats = exports.search = void 0;
const client_1 = require("@prisma/client");
const Message_1 = __importDefault(require("../../../models/Message"));
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
        const lastMessage = yield Message_1.default.findOne({
            $or: [{ senderId: users.id }, { receiverId: users.id }],
        })
            .sort({ timestamp: -1 })
            .lean();
        const chat = {
            id: users.id,
            username: users.name,
            phoneNumber: users.phoneNumber,
            lastMessage: lastMessage
                ? { content: lastMessage.content }
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
        const lastMessage = yield Message_1.default.findOne({
            $or: [
                { senderId: userid, receiverId: user.id },
                { senderId: user.id, receiverId: userid }
            ]
        }).sort({ createdAt: -1 });
        return {
            userid: user.id,
            userName: user.name,
            phoneNumber: user.phoneNumber,
            lastMessage: lastMessage ? lastMessage.content : null, // Add other message fields as needed
            lastMessageTime: lastMessage ? lastMessage.createdAt : null // Adjust as per your message schema
        };
    })));
    res.status(200).json(chats);
});
exports.getAllchats = getAllchats;
