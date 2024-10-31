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
    const phoneNumber = String(req.query.phone);
    const currentUserId = parseInt(req.user.id);
    try {
        // Find all users matching the search term, excluding the current user
        const users = yield prisma.user.findMany({
            where: {
                AND: [
                    {
                        id: {
                            not: currentUserId
                        }
                    },
                    {
                        OR: [
                            { phoneNumber: { contains: phoneNumber, mode: 'insensitive' } },
                            { name: { contains: phoneNumber, mode: 'insensitive' } }
                        ]
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                phoneNumber: true,
            },
            orderBy: {
                name: 'asc' // Sort results by name for easy searching
            }
        });
        res.json(users);
    }
    catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'An error occurred while searching for users.' });
    }
});
exports.search = search;
// get all chats with the users
const getAllchats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = parseInt(req.user.id);
    const chats = yield prisma.messages.findMany({
        where: {
            OR: [
                { senderid: userid },
                { receiverid: userid }
            ]
        },
        orderBy: {
            timestamp: 'desc' // Order by latest message timestamp
        }
    });
    // Extract unique chat partners and last message for each
    const uniqueChats = [];
    const seenUserIds = new Set();
    for (const chat of chats) {
        // Determine the chat partner
        const partnerId = chat.senderid === userid ? chat.receiverid : chat.senderid;
        if (!seenUserIds.has(partnerId)) {
            const partner = yield prisma.user.findUnique({
                where: { id: partnerId },
                select: {
                    id: true,
                    name: true,
                    phoneNumber: true,
                }
            });
            const lastMessage = yield prisma.messages.findFirst({
                where: {
                    OR: [
                        { senderid: userid, receiverid: partnerId },
                        { senderid: partnerId, receiverid: userid }
                    ]
                },
                orderBy: { timestamp: 'desc' },
                select: { content: true, timestamp: true }
            });
            uniqueChats.push({
                userid: partner.id,
                userName: partner.name,
                phoneNumber: partner.phoneNumber,
                lastMessage: lastMessage.content,
                lastMessageTime: lastMessage.timestamp
            });
            seenUserIds.add(partnerId);
        }
    }
    res.json(uniqueChats);
});
exports.getAllchats = getAllchats;
