"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendotp = exports.getotp = void 0;
const twilio_1 = __importDefault(require("twilio"));
const sid = process.env.ACCOUNT_SID;
const authtoken = process.env.AUTH_TOKEN;
const client = (0, twilio_1.default)(sid, authtoken);
const mine = "+918700629012";
const formatPhoneNumber = (phoneNumber) => {
    let cleanedNumber = phoneNumber.replace(/\D/g, '');
    let final = "+91" + cleanedNumber;
    return final;
};
const sendotp = (phoneNumber, otp) => {
    const tosend = formatPhoneNumber(phoneNumber);
    client.messages.create({
        to: tosend,
        from: mine,
        body: `Your verification otp is ${otp}`
    })
        .then((message) => console.log(`Message sent: ${message.sid}`))
        .catch((error) => console.log(`Error occured during sending sms ${error}`));
};
exports.sendotp = sendotp;
const getotp = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.getotp = getotp;
