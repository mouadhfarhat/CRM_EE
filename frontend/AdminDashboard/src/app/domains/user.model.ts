// src/app/models/user.model.ts
export interface User {
    id: number;
        role?: string;
    username: string;
    email: string;
    password?: string;  // Optional for security
    firstname: string;
    lastname: string;
    phoneNumber: string;
  imageUrl?: string; // ✅ renamed from image to imageUrl
  }