import { gql } from 'apollo-server-express';

export default gql`
    type User {
        id: ID!
        username: String!
        createdAt: Float!
        games: [Game!]!
        token: String
        friends: [User!]!
        avatarUrl: String!
        notifications: [Notifications!]!
        highestScore: Int
        wins: Int
    }

    enum NotificationTypes {
        FriendRequest
        GameInvitation
    }

    type Notifications {
        id: ID!
        type: NotificationTypes!
        from: User!
        slug: String
    }

    type File {
        url: String!
    }

    type TopTen {
        name: String!
        amount: Int!
    }

    extend type Query {
        getUser(username: String!): User
        getAllUsers(username: String!): [User!]!
        currentUser: User
        signIn(username: String!, password: String!): User
        getUserCount: Int
        mostPlayedGames: [TopTen!]!
        highestScores: [TopTen!]!
        mostWins: [TopTen!]!
    }

    extend type Mutation {
        signUp(username: String!, password: String!): User 
        addProfilePicture(file: Upload!): File
        sendNotification(type: NotificationTypes!, to: [String!]!, slug: String): User
        dismissNotification(id: ID!): User
        acceptFriendRequest(id: ID!): User
        editProfile(username: String!): User
    }

    extend type Subscription {
        userDataChanged(id: ID!): User
    }
`;