import { AuthInputValues, ChatMessage, ContextType, InTurnPlayer, PublicUser, ScoreboardColumn } from "../../types";
import { login } from "../../passport/authentication";
import bcrypt from 'bcryptjs';
import User from '../../models/userModel';
import pubSub from '../pubsub';

export default {
    Query: {
        getUser: (_parent: unknown, args: { username: string }) => User.findOne({ username: args.username }, '-password').populate('games'),
        getOnlineUsers: () => User.find({}, '-password').where('status').equals('online').populate('games'),
        getAllUsers: () => User.find({}).populate('games'),
        currentUser: (_parent: unknown, _args: unknown, context: ContextType) => User.findOne({ username: context.user.username }, '-password').populate('games'),
        signIn: async (_parent: unknown, args: AuthInputValues, context: ContextType) => {
            try {
                const { req, res } = context;
                req.body = args;

                const loginResponse = await login(req, res);

                return {
                    ...loginResponse.user,
                    id: loginResponse.user._id as string,
                    token: loginResponse.token
                };
                
            } catch (error) {
                throw new Error(`Error while signing in: ${error.message}`);
            }
        }
    },
    Mutation: {
        signUp: async (_parent: unknown, args: AuthInputValues) => {
            try {
                const { username, password } = args;

                const hashedPassword = await bcrypt.hash(password, 12);
                const createdAt = Date.now();
                const user = new User({ username, createdAt, password: hashedPassword, games: [], admin: false });

                delete user.password;
    
                return user.save();
            } catch (error) {
                throw new Error(`Error while signing up: ${error.message}`);
            }
        }
    },
    ScoreboardColumn: {
        player: (parent: ScoreboardColumn) => User.findById(parent.player, '-password')
    },
    InTurnPlayer: {
        player: (parent: InTurnPlayer) => User.findById(parent.player, '-password')
    },
    ChatMessage: {
        user: (parent: ChatMessage) => User.findById(parent.user, '-password')
    },
    Subscription: {
        userDataChanged: {
            subscribe: (_parent: unknown, args: { username: string }) => pubSub.asyncIterator<PublicUser>([args.username])
        }
    }
}