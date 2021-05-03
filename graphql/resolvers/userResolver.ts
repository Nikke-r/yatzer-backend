import { 
    AuthInputValues, 
    ChatMessage, 
    ContextType,
    GameStatus,
    InTurnPlayer, 
    NotificationTypes, 
    PublicUser, 
    Result, 
    ScoreboardColumn 
} from "../../types";
import { login } from "../../passport/authentication";
import bcrypt from 'bcryptjs';
import User from '../../models/userModel';
import pubSub from '../pubsub';
import path from 'path';
import fs from 'fs';
import { ObjectId } from "mongoose";

export default {
    Query: {
        getUserCount: () => User.countDocuments({}),
        mostPlayedGames: async () => {
            try {
                const docs = await User.find({}, 'username games').populate('games', 'status');

                const onlyEndedGames = docs.map(doc => {
                    const endedGamesByUser = doc.games!.filter(game => game.status === GameStatus.Ended);

                    return {
                        username: doc.username,
                        games: endedGamesByUser,
                    }
                });

                const sorted = onlyEndedGames.sort((a, b) => {
                    const aGames = (a.games?.length || 0);
                    const bGames = (b.games?.length || 0);

                    if (aGames > bGames) return -1;
                    if (aGames < bGames) return 1;
                    return 0;
                });

                const topTen = sorted.splice(0, 10).map(item => ({ name: item.username, amount: (item.games?.length || 0) }));

                return topTen;
            } catch (error) {
                throw new Error(error);
            }
        },
        highestScores: async () => {
            try {
                const docs = await User.find({}, 'username highestScore');

                const sorted = docs.sort((a, b) => {
                    const aScore = (a.highestScore || 0);
                    const bScore = (b.highestScore || 0);

                    if (aScore > bScore) return -1;
                    if (aScore < bScore) return 1;

                    return 0;
                });

                const topTen = sorted.splice(0, 10).map(item => ({ name: item.username, amount: (item.highestScore || 0) }));

                return topTen;
            } catch (error) {
                throw new Error(error);      
            }
        },
        mostWins: async () => {
            try {
                const docs = await User.find({}, 'username wins');

                const sorted = docs.sort((a, b) => {
                    const aWins = (a.wins || 0);
                    const bWins = (b.wins || 0);

                    if (aWins > bWins) return -1;
                    if (aWins < bWins) return 1;
                    return 0;
                });

                const topTen = sorted.splice(0, 10).map(item => ({ name: item.username, amount: (item.wins || 0) }));

                return topTen;
            } catch (error) {
                throw new Error(error);
            }
        },
        getUser: async (_parent: unknown, args: { username: string }) => User.findByNameAndPopulate(args.username),
        getAllUsers: async (_parent: unknown, args: { username: string }, context: ContextType) => {
            try {
                const currentUser = context.user;
                if (!currentUser) throw new Error('Not authenticated');

                const users = await User.find({});

                if (!users) throw new Error('Did not find users');

                return users.filter(user => user.username.toLowerCase().includes(args.username.toLowerCase()));
            } catch (error) {
                throw new Error(error.message);
            }
        },
        currentUser: (_parent: unknown, _args: unknown, context: ContextType) => User.findByNameAndPopulate(context.user.username),
        signIn: async (_parent: unknown, args: AuthInputValues, context: ContextType) => {
            try {
                const { req, res } = context;
                req.body = args;

                const loginResponse = await login(req, res);

                const responseUser = await User.findByNameAndPopulate(loginResponse.user.username);

                return {
                    ...loginResponse.user,
                    id: responseUser!.id,
                    notifications: responseUser!.notifications,
                    friends: responseUser!.friends,
                    games: responseUser!.games,
                    token: loginResponse.token
                };
                
            } catch (error) {
                throw new Error(error);
            }
        }
    },
    Mutation: {
        signUp: async (_parent: unknown, args: AuthInputValues, context: ContextType) => {
            try {
                const { username, password } = args;

                const hashedPassword = await bcrypt.hash(password, 12);
                const createdAt = Date.now();

                const user = new User({ 
                    username,
                    createdAt, 
                    password: hashedPassword, 
                    games: [], 
                    friends: [],
                    avatarUrl: '',
                    highestScore: 0,
                    wins: 0,
                });

                delete user.password;
    
                return user.save();
            } catch (error) {
                throw new Error(error);
            }
        },
        addProfilePicture: async (_parent: unknown, args: any, context: ContextType) => {
            try {
                const currentUser = await User.findByNameAndPopulate(context.user.username);

                if (!currentUser) throw new Error('Not authenticated');

                const { createReadStream, filename } = await args.file;

                const { ext } = path.parse(filename);
                
                const stream = createReadStream();
                const pathName = path.join(__dirname, `../../public/avatars/${context.user.username}${ext}`);
                await stream.pipe(fs.createWriteStream(pathName));

                //Not in use in the production yet, since I am missing an image bucket where to store the images

                currentUser.avatarUrl = `http://localhost:3001/public/avatars/${context.user.username}${ext}`;

                await currentUser.save();

                pubSub.publish(currentUser.username, { userDataChanged: currentUser });

                return {
                    url: `http://localhost:3001/public/avatars/${context.user.username}${ext}`
                }
            } catch (error) {
                throw new Error(error.message);
            }
        },
        sendNotification: async (_parent: unknown, args: { type: NotificationTypes, to: string[], slug?: string }, context: ContextType) => {
            try {
                if (!context.user) throw new Error('Not authenticated');

                args.to.forEach(async to => {
                    const toUser = await User.findByNameAndPopulate(to);

                    if (!toUser) throw new Error('User not found');
    
                    if (!toUser.notifications) toUser.notifications = [];
                    toUser.notifications = toUser.notifications.concat({ type: args.type, from: context.user, slug: args.slug });
    
                    await toUser.save();

                    pubSub.publish(toUser.username, { userDataChanged: toUser });
                });

                return context.user;
            } catch (error) {
                throw new Error(error);
            }
        },
        dismissNotification: async (_parent: unknown, args: { id: ObjectId }, context: ContextType) => {
            try {
                if (!context.user) throw new Error('Not authenticated');

                const populatedUser = await User.findByNameAndPopulate(context.user.username);

                if (!populatedUser) throw new Error('Something went wrong');

                populatedUser.notifications = populatedUser.notifications.filter(notification => notification.id !== args.id);

                await populatedUser.save();
                
                pubSub.publish(populatedUser.username, { userDataChanged: populatedUser });

                return populatedUser;
            } catch (error) {
                throw new Error(error);
            }
        },
        acceptFriendRequest: async (_parent: unknown, args: { id: ObjectId }, context: ContextType) => {
            try {
                if (!context.user) throw new Error('Not authenticated');

                const populatedUser = await User.findByNameAndPopulate(context.user.username);
                if (!populatedUser) throw new Error('Something went wrong');

                const request = populatedUser.notifications.find(notification => notification.id === args.id);
                if (!request) throw new Error('Request not found');

                const sender = await User.findByNameAndPopulate(request.from.username);
                if (!sender) throw new Error('Sender not found');

                if (!populatedUser.friends) populatedUser.friends = [];
                populatedUser.friends = populatedUser.friends.concat(sender);
                
                if (!sender.friends) sender.friends = [];
                sender.friends = sender.friends.concat(populatedUser);

                populatedUser.notifications = populatedUser.notifications.filter(notification => notification.id !== args.id);

                await populatedUser.save();
                await sender.save();

                pubSub.publish(populatedUser.username, { userDataChanged: populatedUser });
                pubSub.publish(sender.username, { userDataChanged: sender });

                return populatedUser;
            } catch (error) {
                throw new Error(error);
            }
        },
        editProfile: async (_parent: unknown, args: { username: string }, context: ContextType) => {
            try {
                if (!context.user) throw new Error('Not authenticated');

                const updatedUser = await User.findOneAndUpdate({ username: context.user.username }, { ...args }, { new: true });

                if (!updatedUser) throw new Error('User not found');

                pubSub.publish(context.user.username, { userDataChanged: updatedUser });

                return updatedUser;
            } catch (error) {
                throw new Error(error);
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
    Result: {
        player: (parent: Result) => User.findById(parent.player, '-password'),
    },
    Subscription: {
        userDataChanged: {
            subscribe: (_parent: unknown, args: { username: string }) => pubSub.asyncIterator<PublicUser>([args.username])
        }
    }
}