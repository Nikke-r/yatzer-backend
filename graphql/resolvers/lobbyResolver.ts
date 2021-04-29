import Lobby from '../../models/lobbyModel';
import { ChatMessage, ContextType, NewMessageArgs } from '../../types';
import pubSub from '../pubsub';

export default {
    Query: {
        getLobby: async () => {
            try {
                let lobby = await Lobby.findLobbyAndPopulate('general');

                if (!lobby) lobby = new Lobby({ name: 'general', users: [], messages: [] });
                
                return lobby;
            } catch (error) {
                throw new Error(error);
            }
        },
    },
    Mutation: {
        addUserToLobby: async (_parent: unknown, _args: unknown, context: ContextType) => {
            try {
                if (!context.user) throw new Error('Not authenticated');

                let lobby = await Lobby.findLobbyAndPopulate('general');

                if (!lobby) lobby = new Lobby({ name: 'general', users: [], messages: [] });

                lobby.users = lobby.users.concat(context.user);

                await lobby.save();
                
                pubSub.publish('general', { lobbyDataChanged: lobby });

                return lobby;
            } catch (error) {
                throw new Error(error);
            }
        },
        removeUserFromLobby: async (_parent: unknown, _args: unknown, context: ContextType) => {
            try {
                if (!context.user) throw new Error('Not authenticated');

                const lobby = await Lobby.findLobbyAndPopulate('general');

                if (!lobby) throw new Error('Lobby not find');

                lobby.users = lobby.users.filter(user => user.username !== context.user.username);

                await lobby.save();
                
                pubSub.publish('general', { lobbyDataChanged: lobby });

                return lobby;
            } catch (error) {
                throw new Error(error);
            }
        },
        sendMessageToLobby: async (_parent: unknown, args: NewMessageArgs, context: ContextType) => {
            try {
                if (!context.user) throw new Error('Not authenticated');

                const lobby = await Lobby.findLobbyAndPopulate('general');
                if (!lobby) throw new Error('Lobby not found');

                const newMessage: ChatMessage = {
                    user: context.user,
                    message: args.message,
                    timestamp: Date.now()
                }

                lobby.messages = lobby.messages.concat(newMessage);
                await lobby.save();

                pubSub.publish('general', { lobbyDataChanged: lobby });

                return lobby;
            } catch (error) {
                throw new Error(error);
            }
        }
    },
    Subscription: {
        lobbyDataChanged: {
            subscribe: () => pubSub.asyncIterator(['general'])
        }
    }
}