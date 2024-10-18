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
exports.Login = exports.Signup = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const userSchema = zod_1.z.object({
    name: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
    password: zod_1.z.string()
});
const Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.Signup = Signup;
const loginSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string(),
    password: zod_1.z.string()
});
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.Login = Login;
const verifyOTPSchema = zod_1.z.object({
    PhoneNumber: zod_1.z.string(),
    OTP: zod_1.z.string()
});
