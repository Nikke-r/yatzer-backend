import { AuthenticationError } from "apollo-server-express";
import { 
    ContextType, 
    GameStatus, 
    DiceSelectionArgs, 
    ScorePostingArgs, 
    NewMessageArgs, 
    ChatMessage, 
    GameArgsBaseType, 
    ScoreboardRowName, 
    GameType, 
} from "../../types";
import Game from '../../models/gameModel';
import { 
    createSlug, 
    createGameDices, 
    createScoreboardColumn, 
    rollDices, validateScore, 
    calculateSum, 
    calculateTotal 
} from "../../utils/helpers";
import pubSub from '../pubsub';

export default {
    Query: {
        getGame: (_parent: unknown, args: GameArgsBaseType) => Game.findOne({ slug: args.slug }),
    },
    Mutation: {
        createGame: async (_parent: unknown, _args: unknown, context: ContextType) => {
            try {
                if (!context.user) throw new AuthenticationError('Not authenticated!');

                const slug = createSlug();
                const dices = createGameDices(5);
                const gameColumn = createScoreboardColumn(context.user);
                const createdAt = Date.now();

                const newGame = new Game({
                    slug,
                    dices,
                    scoreboard: [gameColumn],
                    inTurn: {
                        player: context.user._id,
                        numberOfThrows: 0,
                        rolling: false,
                    },
                    status: 'created',
                    messages: [],
                    createdAt,
                });

                if (context.user.games) {
                    context.user.games = context.user.games.concat(newGame);
                } else {
                    context.user.games = [newGame];
                }
                
                await context.user.save();

                pubSub.publish(context.user.username, { userDataChanged: context.user });

                return newGame.save();
            } catch (error) {
                throw new Error(`Error while creating the game: ${error.message}`);
            }
        },
        joinGame: async (_parent: unknown, args: GameArgsBaseType, context: ContextType) => {
            try {

                if (!context.user) throw new AuthenticationError('Not authenticated!');

                const game = await Game.findOne({ slug: args.slug }).populate('scoreboard.player');

                if (!game) throw new Error(`Game with slug: ${args.slug} not found!`);
                if (game.scoreboard.length >= 5) throw new Error('Game is already full');
                if (game.status === GameStatus.Started) throw new Error('Game is already running');
                if (game.scoreboard.find(player => player.player.username === context.user.username)) return;
                
                const gameColumn = createScoreboardColumn(context.user);
                game.scoreboard = game.scoreboard.concat(gameColumn);

                if (context.user.games) {
                    context.user.games = context.user.games.concat(game);
                }

                await context.user.save();

                pubSub.publish(context.user.username, { userDataChanged: context.user });
                pubSub.publish(args.slug, { gameDataChanged: game });

                return game.save();
            } catch (error) {
                throw new Error(`Error while joining the game: ${error.message}`);
            }
        },
        rollDices: async (_parent: unknown, args: GameArgsBaseType, context: ContextType) => {
            try {
                if (!context.user) throw new AuthenticationError('Not authenticated!');
                
                const game = await Game.findOne({ slug: args.slug }).populate('inTurn.player').populate('scorecard.player').populate('messages.user');

                if (!game) throw new Error(`Game with slug: ${args.slug} not found!`);
                if (game.inTurn.player.id !== context.user.id) throw new Error('Not in turn!');
                if (game.inTurn.numberOfThrows >= 3) throw new Error('All three throws have been used!');
                if (game.status === 'created') game.status = GameStatus.Started;

                game.inTurn.rolling = true;
                pubSub.publish(args.slug, { gameDataChanged: game });

                const newDices = rollDices(game.dices);

                game.dices = newDices;
                game.inTurn.numberOfThrows = game.inTurn.numberOfThrows + 1;

                game.inTurn.rolling = false;

                await game.save();

                pubSub.publish(args.slug, { gameDataChanged: game });

                return game;
            } catch (error) {
                throw new Error(`Error while rolling the dices: ${error.message}`);
            }
        },
        toggleDiceSelection: async (_parent: unknown, args: DiceSelectionArgs, context: ContextType) => {
            try {
                if (!context.user) throw new AuthenticationError('Not authenticated!');

                const game = await Game.findOne({ slug: args.slug }).populate('inTurn.player').populate('scorecard.player').populate('messages.user');

                if (!game) throw new Error(`Game with slug: ${args.slug} not found!`);
                if (game.inTurn.player.id !== context.user.id) throw new Error('Not in turn!');
                if (game.inTurn.numberOfThrows === 0) throw new Error('You need to roll dices before you can select them');

                game.dices[args.diceIndex].selected = !game.dices[args.diceIndex].selected;

                await game.save();

                pubSub.publish(args.slug, { gameDataChanged: game });

                return game;
            } catch (error) {
                throw new Error(`Error while toggling the dice selection: ${error.message}`);
            }
        },
        postScore: async (_parent: unknown, args: ScorePostingArgs, context: ContextType) => {
            try {
                if (!context.user) throw new AuthenticationError('Not authenticated!');

                const game = await Game.findOne({ slug: args.slug }).populate('inTurn.player').populate('scoreboard.player').populate('messages.user');

                if (!game) throw new Error(`Game with slug: ${args.slug} not found!`);
                if (game.inTurn.player.id !== context.user.id) throw new Error('Not in turn!');
                if (game.inTurn.numberOfThrows === 0) throw new Error('You need to roll dices first!');
                if (args.rowName === ScoreboardRowName.Sum || args.rowName === ScoreboardRowName.Bonus || args.rowName === ScoreboardRowName.Total) throw new Error('Cannot post score to this row');

                const score = validateScore(game.dices, args.rowName);

                const scoreboardColumn = game.scoreboard.find(column => column.player.id === context.user.id);

                if (scoreboardColumn) {
                    const scoreboardRow = scoreboardColumn.rows.find(row => row.name === args.rowName);

                    if (scoreboardRow) {

                        if (scoreboardRow.filled) {
                            throw new Error('Field already filled!');
                        }

                        scoreboardRow.score = score;
                        scoreboardRow.filled = true;

                        const currentPlayerIndex = game.scoreboard.findIndex(column => column.player.id === game.inTurn.player.id);

                        game.inTurn.player = currentPlayerIndex === game.scoreboard.length - 1 ? game.scoreboard[0].player : game.scoreboard[currentPlayerIndex + 1].player;
                        game.inTurn.numberOfThrows = 0;

                        const scoreCopy = [...scoreboardColumn.rows];

                        const upperSection = scoreCopy.splice(0, 6);
                        const sum = calculateSum(upperSection);
    
                        if (sum) {
                            scoreboardColumn.rows[6].score = sum;
                            scoreboardColumn.rows[6].filled = true;
    
                            if (sum >= 63) {
                                scoreboardColumn.rows[7].score = 50;
                                scoreboardColumn.rows[7].filled = true;
                            } else {
                                scoreboardColumn.rows[7].score = 0;
                                scoreboardColumn.rows[7].filled = true;
                            }
                        }

                        const lowerSection = scoreCopy.splice(0, 11);
                        const total = calculateTotal(lowerSection);

                        if (total) {
                            scoreboardColumn.rows[17].score = total;
                            scoreboardColumn.rows[17].filled = true;

                            if (currentPlayerIndex === game.scoreboard.length - 1) {
                                game.status = GameStatus.Ended;
                            }
                        }
                    }
                }

                game.dices = game.dices.map(dice => {
                    dice.selected = false;
                    return dice;
                });

                pubSub.publish(args.slug, { gameDataChanged: game });

                return game.save();
            } catch (error) {
                throw new Error(`Error posting the score: ${error.message}`);
            }
        },
        newMessage: async (_parent: unknown, args: NewMessageArgs, context: ContextType) => {
            try {
                if (!context.user) throw new AuthenticationError('Not authenticated!');

                const game = await Game.findOne({ slug: args.slug }).populate('scoreboard.player').populate('inTurn.player').populate('messages.user');
    
                if (!game) throw new Error(`Game with slug: ${args.slug} not found!`);
                if (!game.scoreboard.find(column => column.player.id === context.user.id)) throw new Error(`Not in the game!`);
                if (!args.message || args.message.length < 2 || args.message.length > 20) throw new Error('Message must be at least three characters and maximun of 20 characters');

                const newMessage: ChatMessage = {
                    timestamp: Date.now(),
                    user: context.user,
                    message: args.message
                };

                game.messages = game.messages.concat(newMessage);

                pubSub.publish(args.slug, { gameDataChanged: game });

                return game.save();
            } catch (error) {
                throw new Error(`Error while posting a new message: ${error.message}`);
            }
        },
    },
    Subscription: {
        gameDataChanged: {
            subscribe: (_parent: unknown, args: GameArgsBaseType) => pubSub.asyncIterator<GameType>([args.slug]),
        }
    }
}