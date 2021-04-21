import mongoose from 'mongoose';
import { DatabaseUser } from '../types';

const userModel = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 15,
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
        default: 'online',
        enum: [
            "online",
            "offline"
        ]
    },
    admin: Boolean,
    socketId: String,
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    notifications: [
        {
            from: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            message: {
                type: String,
                required: true,
            }
        }
    ]
});

export default mongoose.model<DatabaseUser>('User', userModel);