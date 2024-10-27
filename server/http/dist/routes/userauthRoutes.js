"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userauth_1 = require("../controllers/userauth");
const authmiddleware_1 = __importDefault(require("../middlewares/authmiddleware"));
router.post('/signup', userauth_1.Signup);
router.post('/verify-otp', userauth_1.verifyOTP);
router.post('/login', userauth_1.Login);
router.get('/recipentdetails', authmiddleware_1.default, userauth_1.recipentdetails);
router.get('/userDetails', authmiddleware_1.default, userauth_1.userDetails);
exports.default = router;
