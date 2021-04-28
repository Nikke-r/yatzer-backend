import { gql } from 'apollo-server-express';

export default gql`
    type Game {
        id: ID!
        slug: String!
        scoreboard: [ScoreboardColumn!]!
        dices: [Dice!]!
        inTurn: InTurnPlayer!
        status: GameStatus!
        messages: [ChatMessage!]!
        createdAt: Float!
        finalResult: [Result!]!
    }

    type Result {
        player: User!
        score: Int!
    }

    type ScoreboardColumn {
        player: User!
        rows: [ScoreboardRow!]!
    }

    type ScoreboardRow {
        name: String!
        filled: Boolean!
        score: Int!
    }

    type Dice {
        value: Int!
        selected: Boolean!
    }

    type InTurnPlayer {
        player: User!
        numberOfThrows: Int!
        rolling: Boolean!
    }

    type ChatMessage {
        timestamp: Float!
        message: String!
        user: User!
    }

    enum GameStatus {
        created
        started
        ended
    }

    enum ScoreboardRowName {
        Aces
        Twos
        Threes
        Fours
        Fives
        Sixes
        Sum
        Bonus
        Pair
        TwoPairs
        ThreeOfAKind
        FourOfAKind
        SmallStraight
        LargeStraight
        FullHouse
        Chance
        Yatzy
        Total
    }

    extend type Query {
        getGame(slug: String!): Game
        getGameCount: Int
    }

    extend type Mutation {
        createGame: Game
        joinGame(slug: String!): Game
        rollDices(slug: String!): Game
        toggleDiceSelection(slug: String!, diceIndex: Int!): Game
        postScore(slug: String!, rowName: ScoreboardRowName!): Game
        newMessage(slug: String!, message: String!): Game
    }

    extend type Subscription {
        gameDataChanged(slug: String!): Game
    }
`;