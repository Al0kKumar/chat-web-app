import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';

const auth = (req: Request,res: Response, next : NextFunction) => {
     
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token){
        return res.status(401).json({msg:"No token provided"})
    }


    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
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