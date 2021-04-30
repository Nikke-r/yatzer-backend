import { ApolloServer } from 'apollo-server-express';
import { Request, Response, NextFunction, Express } from 'express';
import https from 'https';

export default (app: Express, port: number | string, server: ApolloServer) => {
    app.enable('trust proxy');

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.secure) {
            next();
        } else {
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    });
    const httpsServer = https.createServer(app);

    server.installSubscriptionHandlers(httpsServer);

    httpsServer.listen(port, () => console.log('Server running!'));
};
