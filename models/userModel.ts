import mongoose from 'mongoose';
import { DatabaseUser } from '../types';

const userModel = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        required: true,
        unique: true,
    },
    createdAt: Number,
    password: {
        type: String,
        min: 5,
        required: true,
    },
    games: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game'
        }
    ],
    status: {
        type: String,
        enum: [
            "online",
            "offline"
        ]
    }
});

export default mongoose.model<DatabaseUser>('User', userModel);