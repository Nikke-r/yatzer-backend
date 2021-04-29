import https from 'https';
import http from 'http';
import fs from 'fs';
import { Request, Response, Express } from 'express';
import { ApolloServer } from 'apollo-server-express';

const sslKey = fs.readFileSync('../ssl-key.pem');
const sslCert = fs.readFileSync('../ssl-cert.pem');

const options = {
    key: sslKey,
    cert: sslCert,
};

const httpRedirect = (req: Request, res: Response) => {
    res.writeHead(301, { 'location': `https://localhost:8000${req.url}` });
    res.end();
}

export default (app: Express, httpsPort: number, httpPort: number | string, server: ApolloServer) => {
    const httpsServer = https.createServer(options, app);
    const httpServer = http.createServer(httpRedirect as any);

    server.installSubscriptionHandlers(httpsServer);
    server.installSubscriptionHandlers(httpServer);

    httpsServer.listen(httpsPort);
    httpServer.listen(httpPort);
}