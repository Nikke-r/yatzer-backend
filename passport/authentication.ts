import { Request, Response } from "express";
import passport from "./strategies";
import { DatabaseUser, PublicUser } from "../types";
import jwt from 'jsonwebtoken';

export const login = (req: Request, res: Response) => {
    return new Promise<{ user: PublicUser, token: string }>((resolve, reject) => {
        passport.authenticate('local', { session: false }, (error, user: DatabaseUser, info) => {
            if (error || !user) reject(info.message);

            req.login(user, { session: false }, error => {
                if (error) reject(error);

                if (process.env.JWT_SECRET) {
                    const tokenUser = { ...user };
                    delete tokenUser.games;
                    
                    const token = jwt.sign(tokenUser, process.env.JWT_SECRET);

                    resolve({ user, token });
                }
            });
        })(req, res);
    });
};

export const checkAuthentication = (req: Request, res: Response) => {
    return new Promise<PublicUser | boolean>((resolve, _reject) => {
        passport.authenticate('jwt', (error, user) => {
            if (error) resolve(false);

            resolve(user);
        })(req, res);
    });
};