// lib/db/models/user.ts
import mongoose from "mongoose";

interface User {
    name: string;
    phoneNumber: string;
    category?: 'frontend' | 'backend';
    isVerified: boolean;
    lastJobSend?: Date;
    jobsSent?: number;
    createdAt: Date;
}

const userSchema = new mongoose.Schema<User>({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    category: { type: String, enum: ['frontend', 'backend'] },
    isVerified: { type: Boolean, default: false },
    lastJobSend: { type: Date },
    jobsSent: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

export type UserDocument = mongoose.HydratedDocument<User>;
export const userModel = mongoose.models.User || mongoose.model<User>('User', userSchema);