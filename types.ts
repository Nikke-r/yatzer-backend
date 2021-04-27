import { Request, Response } from "express";
import mongoose from "mongoose";

export interface DatabaseUser extends mongoose.Document {
    id: mongoose.ObjectId,
    username: string;
    password?: string;
    createdAt: number;
    games?: GameType[];
    status: 'online' | 'offline';
    admin: boolean;
    socketId?: string;
    friends?: PublicUser[];
    avatarUrl: string;
    notifications: Notifications[];
}

export enum NotificationTypes {
    FriendRequest = "FriendRequest",
    GameInvitation = "GameInvitation"
}

export interface Notifications {
    id?: mongoose.ObjectId;
    type: NotificationTypes;
    from: PublicUser;
    slug?: string;
}

export type PublicUser = Omit<DatabaseUser, 'password'>;

export enum ScoreboardRowName {
    Aces = 'Aces',
    Twos = 'Twos',
    Threes = 'Threes',
    Fours = 'Fours',
    Fives = 'Fives',
    Sixes = 'Sixes',
    Sum = 'Sum',
    Bonus = 'Bonus',
    Pair = 'Pair',
    TwoPairs = 'TwoPairs',
    ThreeOfKind = 'ThreeOfAKind',
    FourOfKind = 'FourOfAKind',
    SmallStraight = 'SmallStraight',
    LargeStraight = 'LargeStraight',
    Fullhouse = 'FullHouse',
    Chance = 'Chance',
    Yatzy = 'Yatzy',
    Total = 'Total'
}

export enum GameStatus {
    Created = 'created',
    Started = 'started',
    Ended = 'ended'
}

export interface ScoreboardRow {
    name: ScoreboardRowName;
    filled: boolean;
    score: number;
}

export interface ScoreboardColumn {
    player: PublicUser;
    rows: ScoreboardRow[];
}

export type Scoreboard = ScoreboardColumn[];

export interface Dice {
    value: number;
    selected: boolean;
}

export interface InTurnPlayer {
    player: PublicUser;
    numberOfThrows: number;
    rolling: boolean;
}

export interface ChatMessage {
    timestamp: number;
    user: PublicUser;
    message: string;
}

export interface GameType extends mongoose.Document {
    id: mongoose.ObjectId;
    slug: string;
    scoreboard: Scoreboard;
    dices: Dice[];
    inTurn: InTurnPlayer;
    status: GameStatus;
    messages: ChatMessage[];
    createdAt: number;
}

export interface AuthInputValues {
    username: string;
    password: string;
}

export interface ContextType {
    req: Request;
    res: Response;
    user: PublicUser;
}

export interface GameArgsBaseType {
    slug: string;
}

export interface DiceSelectionArgs extends GameArgsBaseType {
    diceIndex: number;
}

export interface ScorePostingArgs extends GameArgsBaseType {
    rowName: ScoreboardRowName;
}

export interface NewMessageArgs extends GameArgsBaseType {
    message: string;
}
