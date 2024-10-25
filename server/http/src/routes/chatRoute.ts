import { Router } from "express";
import Chatsbetween from "../controllers/chat";
import auth from "../middlewares/authmiddleware";
import { getAllchats } from "../controllers/searchUser";

const router = Router();

router.get('/chathistory', auth, Chatsbetween )

router.get('/getchats', auth, getAllchats)


export default router ;