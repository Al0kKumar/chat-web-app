"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const chatRoute_1 = __importDefault(require("./routes/chatRoute"));
const searchRoute_1 = __importDefault(require("./routes/searchRoute"));
const userauthRoutes_1 = __importDefault(require("./routes/userauthRoutes")); // Make sure this path is correct
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
require('dotenv').config();
app.use(express_1.default.json());
app.use('/api/v1', userauthRoutes_1.default); // done 
app.use('/api/v1', chatRoute_1.default);
app.use('/api/v1', searchRoute_1.default);
app.listen(process.env.PORT1, () => {
    console.log("server is running on port 8080");
});
