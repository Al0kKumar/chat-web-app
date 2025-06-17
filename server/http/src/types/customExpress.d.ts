import { Request } from 'express';

// Define the shape of your user object
// Adjust this interface based on what your user object actually contains
// interface UserPayload {
//   id: string;
//   email: string;
//   // Add other properties that your user object might have, e.g.,
//   // username: string;
// }

// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: UserPayload; // Make it optional if it's not always present
//     // You can add other custom properties here if needed
//     // customProperty?: string;
//   }
// }


export interface User {
  id: string | number; // Use 'string' if JWT ID is string, or 'number' if it's parsed as number
  email: string;
  // Add any other properties that your JWT payload might contain, e.g.:
  // name?: string;
  // roles?: string[];
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: User; // Now, this 'user' property refers to the 'User' interface defined above
  }
}