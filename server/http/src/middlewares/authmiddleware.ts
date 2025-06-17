import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/customExpress';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY || 'alok', (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ msg: 'Invalid token' });
    }

    req.user = decoded as User; 
    next();
  });
};

export default auth;
