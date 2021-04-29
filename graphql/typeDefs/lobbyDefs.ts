import { gql } from 'apollo-server-express';

export default gql`
    type Lobby {
        users: [User!]!
        messages: [ChatMessage!]!
        name: String!
    }

    extend type Query {
        getLobby: Lobby
    }

    extend type Mutation {
        addUserToLobby(username: String!): Lobby
        removeUserFromLobby(username: String!): Lobby
        sendMessageToLobby(message: String!): Lobby
    }

    extend type Subscription {
        lobbyDataChanged: Lobby
    }
`;