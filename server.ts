import 'dotenv/config';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import connectMongo from './database/dbConnection';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { checkAuthentication } from './passport/authentication';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';

(async () => {
    try {
        await connectMongo();

        const app = express();
        app.use(cors());
        app.use(helmet({
            ieNoOpen: false,
            contentSecurityPolicy: false
        }));
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
        server.applyMiddleware({ app, cors: false, path: '/graphql' });

        process.env.NODE_ENV = process.env.NODE_ENV || 'development';

        if (process.env.NODE_ENV === 'production') {
            const { default: production } = await import('./security/production');
            production(app, (process.env.PORT || 3001), server);
        } else {
            const { default: localhost } = await import('./security/localhost');
            localhost(app, 8000, 3001, server);
        }
    } catch (error) {
        console.log(`Error while starting the server: ${error.message}`);
    }
})();