// src/types/express.d.ts
import { Request } from 'express';
import { File } from 'multer';

// Define the structure of your User object
interface UserPayload {
  id: number;
//  email: string;
  // Add any other properties that your user object might have
}

declare module 'express' {
  interface Request {
    user?: UserPayload; // Make it optional if it might not always be present
    file?: File // new added bro if any issue is there with it , then remove it 
  }
}