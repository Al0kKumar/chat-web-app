import express from 'express'
import auth from '../middlewares/authmiddleware';
import { search } from '../controllers/searchUser';

const router = express.Router();

router.get('/search',auth, search);

export default router