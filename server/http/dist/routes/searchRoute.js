"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = __importDefault(require("../middlewares/authmiddleware"));
const searchUser_1 = require("../controllers/searchUser");
const router = express_1.default.Router();
router.get('/search', authmiddleware_1.default, searchUser_1.search);
exports.default = router;
