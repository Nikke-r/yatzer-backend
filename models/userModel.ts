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
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    avatarUrl: String,
    notifications: [
        {
            from: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            type: {
                type: String,
                enum: [
                    "FriendRequest", //Friend Request
                    "GameInvitation", //Game Invitation
                ]
            },
            slug: String
        }
    ],
    highestScore: Number,
    wins: Number,
});

userModel.statics.findByNameAndPopulate = async function(username: string): Promise<DatabaseUser | null> {
    return await this.findOne({ username }, '-password').populate([
        {
            path: 'games'
        },
        {
            path: 'friends'
        },
        {
            path: 'notifications.from',
        }
    ]);
};

interface UserModelStaticMethods extends mongoose.Model<DatabaseUser> {
    findByNameAndPopulate: (username: string) => Promise<DatabaseUser | null>;
}

export default mongoose.model<DatabaseUser, UserModelStaticMethods>('User', userModel);
