// express.d.ts
import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Use a specific type if you have a user interface
        }
    }
}
