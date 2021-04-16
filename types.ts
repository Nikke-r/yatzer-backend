import { Request, Response } from "express";
import { Document } from "mongoose";

export interface DatabaseUser extends Document {
    username: string;
    password?: string;
    createdAt: number;
    games?: GameType[];
    status: 'online' | 'offline';
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
}

export interface ChatMessage {
    timestamp: number;
    user: PublicUser;
    message: string;
}

export interface GameType extends Document {
    slug: string;
    scoreboard: Scoreboard;
    dices: Dice[];
    inTurn: InTurnPlayer;
    status: GameStatus;
    messages: ChatMessage[];
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