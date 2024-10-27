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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const Chatsbetween = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentuserid = parseInt(req.user.id);
    const recipientid = parseInt(req.query.recipientId);
    console.log("Current User ID:", currentuserid);
    console.log("Recipient ID:", recipientid);
    try {
        const messages = yield prisma.messages.findMany({
            where: {
                OR: [
                    { senderid: currentuserid, receiverid: recipientid },
                    { senderid: recipientid, receiverid: currentuserid },
                ],
            },
            orderBy: {
                timestamp: 'asc', // Sort messages in chronological order
            },
        });
        res.json(messages);
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = Chatsbetween;
