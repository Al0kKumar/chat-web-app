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
exports.getotp = exports.sendotp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
const sendotp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        to: email,
        from: process.env.EMAIL,
        subject: "otp verification",
        text: `Your otp code is this ${otp} .It will expire in 10 mins`
    };
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        yield prisma.user.delete({
            where: { email: email }
        });
        console.error("Error during sending otp", error);
    }
});
exports.sendotp = sendotp;
const getotp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.getotp = getotp;
