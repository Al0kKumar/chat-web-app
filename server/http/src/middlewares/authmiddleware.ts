import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';
const secret = 'alok'

interface CustomRequest extends Request{
    user?:any;
}

const auth = (req: CustomRequest,res: Response, next : NextFunction) => {
     
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token){
        return res.status(401).json({msg:"No token provided"})
    }


    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
        } else {
            console.log('Decoded token:', decoded);
            req.user = decoded;
            next();
        }
    });

}

export default auth;