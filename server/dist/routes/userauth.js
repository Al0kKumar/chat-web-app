"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const userSchema = zod_1.z.object({
    name: zod_1.z.string(),
    phoneNumber: zod_1.z.string()
});
router.post('/signup', (req, res) => {
    const check = userSchema.safeParse(req.body);
    if (!check.success) {
        return res.status(401).json({
            msg: "wrong inputs"
        });
    }
});
exports.default = router;
