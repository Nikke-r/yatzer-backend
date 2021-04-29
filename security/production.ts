import { Request, Response, NextFunction, Express } from 'express';

export default (app: Express, port: number | string) => {
    app.enable('trust proxy');

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.secure) {
            next();
        } else {
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    });

    app.listen(port, () => console.log('Server running!'));
};
