import mongoose from 'mongoose';
import { GameType } from '../types';

const gameModel = new mongoose.Schema({
    createdAt: Number,
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    inTurn: {
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        numberOfThrows: {
            type: Number,
            min: 0,
            max: 3,
        },
        rolling: Boolean,
    },
    scoreboard: [
        {
            player: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            rows: [
                {
                    name: {
                        type: String,
                        required: true,
                        enum: [
                            'Aces',
                            'Twos',
                            'Threes',
                            'Fours',
                            'Fives',
                            'Sixes',
                            'Sum',
                            'Bonus',
                            'Pair',
                            'TwoPairs',
                            'ThreeOfAKind',
                            'FourOfAKind',
                            'SmallStraight',
                            'LargeStraight',
                            'FullHouse',
                            'Chance',
                            'Yatzy',
                            'Total'
                        ]
                    },
                    score: Number,
                    filled: Boolean,
                }
            ]
        }
    ],
    dices: [
        {
            value: Number,
            selected: Boolean,
        }
    ],
    status: {
        type: String,
        enum: [
            'created',
            'started',
            'ended'
        ]
    },
    messages: [
        {
            message: {
                type: String,
                min: 2,
                max: 50,
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            timestamp: Number,
        }
    ]
});

gameModel.statics.findBySlugAndPopulate = async function(slug: string): Promise<GameType | null> {
    return await this.findOne({ slug }).populate([
        {
            path: 'inTurn.player'
        },
        {
            path:'scoreboard.player'
        },
        {
            path: 'messages.user'
        }
    ]);
}

interface GameModelStaticMethods extends mongoose.Model<GameType> {
    findBySlugAndPopulate: (slug: string) => Promise<GameType | null>;
}

export default mongoose.model<GameType, GameModelStaticMethods>('Game', gameModel);