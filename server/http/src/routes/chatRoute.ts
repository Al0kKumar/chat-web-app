import { Router } from "express";
import chathistory from "../controllers/chat";
import auth from "../middlewares/authmiddleware";

const router = Router();

router.post('/chathistory',auth,chathistory)


export default router ;