import mongoose from "mongoose";

interface User {
    name: string;
    phoneNumber: string;
    categories: string[];
    isVerified: boolean;
    created_at: Date;
}


const userSchema = new mongoose.Schema<User>({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    categories: { type: [String], required: true },
    isVerified: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

export const userModel = mongoose.models.User || mongoose.model<User>("User", userSchema);