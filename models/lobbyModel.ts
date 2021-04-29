import mongoose from 'mongoose';
import { LobbyType } from '../types';

const lobbyModel = new mongoose.Schema({
    name: String,
    messages: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            message: String,
            timestamp: Number
        }
    ],
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

lobbyModel.statics.findLobbyAndPopulate = async function(name: string): Promise<LobbyType | null> {
    return await this.findOne({ name }).populate('messages.user').populate('users');
}

interface LobbyStaticMethods extends mongoose.Model<LobbyType> {
    findLobbyAndPopulate: (name: string) => Promise<LobbyType | null>;
}

export default mongoose.model<LobbyType, LobbyStaticMethods>('Lobby', lobbyModel);