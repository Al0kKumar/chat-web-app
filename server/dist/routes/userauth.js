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
const express_1 = require("express");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const client_1 = require("@prisma/client");
const authmiddleware_1 = __importDefault(require("./authmiddleware"));
const prisma = new client_1.PrismaClient();
const userSchema = zod_1.z.object({
    name: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
    password: zod_1.z.string()
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const check = userSchema.safeParse(req.body);
    if (!check.success) {
        return res.status(401).json({
            msg: "wrong inputs"
        });
    }
    const { name, phoneNumber, password } = check.data;
    const userexists = yield prisma.user.findUnique({
        where: { phoneNumber: phoneNumber }
    });
    if (userexists) {
        return res.status(400).json({
            msg: "user already exists with this number "
        });
    }
    const hashedpassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma.user.create({
        data: {
            name,
            phoneNumber,
            password: hashedpassword
        }
    });
    if (!user) {
        return res.status(404).json({
            msg: "something went wrong with us"
        });
    }
    return res.status(201).json({
        msg: "user created successfully"
    });
}));
const loginSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string(),
    password: zod_1.z.string()
});
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const check = loginSchema.safeParse(req.body);
    if (!check.success) {
        return res.status(401).json({
            msg: "invalid inputs"
        });
    }
    const { phoneNumber, password } = check.data;
    const checkuser = yield prisma.user.findUnique({
        where: { phoneNumber: phoneNumber }
    });
    if (!checkuser) {
        return res.status(400).json({ msg: "user doesn't exists" });
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, checkuser.password);
    if (!isPasswordValid) {
        return res.status(401).json({ msg: "wrong password" });
    }
    const token = jsonwebtoken_1.default.sign(checkuser, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ token });
}));
const searchuserSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string()
});
router.get('/search', authmiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.query;
    const check = searchuserSchema.safeParse({ phoneNumber });
    if (!check.success) {
        return res.status(401).json({ msg: "Invalid input" });
    }
    try {
        const users = yield prisma.user.findMany({
            where: {
                phoneNumber: phoneNumber
            }
        });
        if (users.length === 0) {
            return res.status(404).json({ msg: "No users found with that phone number" });
        }
        return res.status(201).json(users);
    }
    catch (error) {
        console.log("error fetching users ", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}));
exports.default = router;
