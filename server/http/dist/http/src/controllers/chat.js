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
const Message_1 = __importDefault(require("@models/Message"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const Chatsbetween = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentuserid = req.user.id;
    const otheruserid = parseInt(req.params.chatId);
    try {
        const messages = yield Message_1.default.find({
            $or: [
                { senderId: currentuserid, receiverId: otheruserid },
                { senderId: otheruserid, receiverId: currentuserid },
            ],
        })
            .sort({ timestamp: 1 }) // Sort messages in chronological order
            .lean();
        res.json(messages);
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = Chatsbetween;
