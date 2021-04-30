import { ApolloServer } from 'apollo-server-express';
import { Request, Response, NextFunction, Express } from 'express';
import http from 'http';

export default (app: Express, port: number | string, server: ApolloServer) => {
    app.enable('trust proxy');

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.secure) {
            next();
        } else {
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    });

    const httpServer = http.createServer(app);

    server.installSubscriptionHandlers(httpServer);

    httpServer.listen(port, () => console.log('Server running!'));
};
