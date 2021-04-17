import 'dotenv/config';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import connectMongo from './database/dbConnection';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { checkAuthentication } from './passport/authentication';
import cors from 'cors';
import http from 'http';
import jwt from 'jsonwebtoken';
import User from './models/userModel';
import { PublicUser } from './types';

(async () => {
    try {
        await connectMongo();

        const app = express();
        app.use(cors());

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: async ({ req, res, connection }) => {
                try {
                    if (connection) {
                        return connection.context;
                    } else {
                        const user = await checkAuthentication(req, res);
                        
                        return {
                            req,
                            res,
                            user
                        };
                    }
                } catch (error) {
                    console.log(`Context error: ${error.message}`);
                    return null;
                }
            },
            subscriptions: {
                onConnect: async (connectionParams: any) => {
                    try {
                        if (!connectionParams.token) {
                            throw new AuthenticationError('Not authenticated')
                        } 
    
                        if (process.env.JWT_SECRET) {
                            const user = jwt.verify(connectionParams.token, process.env.JWT_SECRET) as PublicUser;

                            await User.findOneAndUpdate({ username: user.username }, { status: 'online' })
                        }
                    } catch (error) {
                        throw new Error(`Error on WebSocket connection: ${error.message}`);
                    }
                },
                onDisconnect: () => console.log('Disconnected'),
            },
        });

        await server.start();
        server.applyMiddleware({ app });

        const httpServer = http.createServer(app);
        server.installSubscriptionHandlers(httpServer);

        httpServer.listen((process.env.PORT || 3001), () => console.log(`Server running! GraphQL playground: http://localhost:3001${server.graphqlPath} | Subscription path: ws://localhost:3001${server.subscriptionsPath}`));
    } catch (error) {
        console.log(`Error while starting the server: ${error.message}`);
    }
})();