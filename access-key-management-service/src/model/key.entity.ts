import { Schema, Document } from 'mongoose';

export interface Key extends Document {
    userId: string;
    key: string;
    rateLimit: number;
    expiration: Date;
}

export const KeySchema = new Schema({
    userId: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    rateLimit: { type: Number, required: true },
    expiration: { type: Date, required: true },
    isActive: { type: Boolean, default: false }
});