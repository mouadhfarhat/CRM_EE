// src/app/models/user.model.ts
export interface User {
    id: number;
    username: string;
    email: string;
    password?: string;  // Optional for security
    firstname: string;
    lastname: string;
    phoneNumber: string;
  }