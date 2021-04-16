import { gql } from 'apollo-server-express';

export default gql`
    type User {
        id: ID!
        username: String!
        createdAt: Float!
        games: [Game!]!
        token: String
        status: Status!
    }

    enum Status {
        online
        offline
    }

    extend type Query {
        getAllUsers: [User!]!
        currentUser: User
        signIn(username: String!, password: String!): User
    }

    extend type Mutation {
        signUp(username: String!, password: String!): User
    }

    extend type Subscription {
        userDataChanged(username: String!): User
    }
`;