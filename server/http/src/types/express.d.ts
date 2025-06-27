// src/types/express.d.ts
import { Request } from 'express';

// Define the structure of your User object
interface UserPayload {
  id: number;
//  email: string;
  // Add any other properties that your user object might have
}

declare module 'express' {
  interface Request {
    user?: UserPayload; // Make it optional if it might not always be present
  }
}