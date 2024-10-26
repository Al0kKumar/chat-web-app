"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_1 = __importDefault(require("../controllers/chat"));
const authmiddleware_1 = __importDefault(require("../middlewares/authmiddleware"));
const searchUser_1 = require("../controllers/searchUser");
const router = (0, express_1.Router)();
router.get('/chathistory', authmiddleware_1.default, chat_1.default);
router.get('/getchats', authmiddleware_1.default, searchUser_1.getAllchats);
exports.default = router;
