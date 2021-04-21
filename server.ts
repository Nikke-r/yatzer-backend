import 'dotenv/config';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import connectMongo from './database/dbConnection';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { checkAuthentication } from './passport/authentication';
import cors from 'cors';
import http from 'http';

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
                    if (!connectionParams.token) {
                        throw new AuthenticationError('Not authenticated');
                    } 
                },
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