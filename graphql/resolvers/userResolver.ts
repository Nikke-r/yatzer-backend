import { AuthInputValues, ChatMessage, ContextType, InTurnPlayer, Notification, PublicUser, ScoreboardColumn } from "../../types";
import { login } from "../../passport/authentication";
import bcrypt from 'bcryptjs';
import User from '../../models/userModel';
import pubSub from '../pubsub';

export default {
    Query: {
        getUser: (_parent: unknown, args: { username: string }) => User.findOne({ username: args.username }, '-password').populate('games'),
        getOnlineUsers: () => User.find({}, '-password').where('status').equals('online').populate('games'),
        getAllUsers: () => User.find({}).populate('games'),
        currentUser: async (_parent: unknown, _args: unknown, context: ContextType) => {
            try {
                const user = await User
                                    .findOne({ username: context.user.username }, '-password')
                                    .populate('games')
                                    .populate('friends')
                                    .populate('notifications.from');
                if (!user) throw new Error('User not found');

                return user;
            } catch (error) {
                throw new Error(error.message);
            }
        },
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
        },
        addFriend: async (_parent: unknown, args: { username: string }, context: ContextType) => {
            try {
                const currentUser = context.user;

                if (!currentUser) throw new Error('Not authenticated');

                const user = await User.findOne({ username: args.username });

                if (!user) throw new Error('User not found');

                const newNotification: Notification = {
                    from: currentUser,
                    message: `${currentUser.username} want to be your friend!`,
                }

                if (!user.notifications) {
                    user.notifications = [newNotification];
                } else {
                    user.notifications = user.notifications.concat(newNotification);
                }

                pubSub.publish(user.username, { userDataChanged: user });

                return user.save();
            } catch (error) {
                throw new Error(`Error while adding a new friend: ${error.message}`);
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