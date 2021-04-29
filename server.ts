import 'dotenv/config';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import connectMongo from './database/dbConnection';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { checkAuthentication } from './passport/authentication';
import cors from 'cors';
import http from 'http';
import path from 'path';

(async () => {
    try {
        await connectMongo();

        const app = express();
        app.use(cors());
        app.use("/public/avatars", express.static(path.join(__dirname, "public/avatars")));

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
                    return null;
                }
            },
        });

        await server.start();
        server.applyMiddleware({ app, cors: false });

        const httpServer = http.createServer(app);
        server.installSubscriptionHandlers(httpServer);

        httpServer.listen((process.env.PORT || 3001), () => console.log(`Server running!`));
    } catch (error) {
        console.log(`Error while starting the server: ${error.message}`);
    }
})();