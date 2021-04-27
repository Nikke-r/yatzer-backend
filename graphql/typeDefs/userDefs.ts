import { gql } from 'apollo-server-express';

export default gql`
    type User {
        id: ID!
        username: String!
        createdAt: Float!
        games: [Game!]!
        token: String
        status: Status!
        friends: [User!]!
        avatarUrl: String!
        notifications: [Notifications!]!
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

    enum Status {
        online
        offline
    }

    type File {
        url: String!
    }

    extend type Query {
        getUser(username: String!): User
        getOnlineUsers: [User!]!
        getAllUsers(username: String!): [User!]!
        currentUser: User
        signIn(username: String!, password: String!): User
    }

    extend type Mutation {
        signUp(username: String!, password: String!): User 
        addProfilePicture(file: Upload!): File
        sendNotification(type: NotificationTypes!, to: [String!]!, slug: String): User
        dismissNotification(id: ID!): User
        acceptFriendRequest(id: ID!): User
    }

    extend type Subscription {
        userDataChanged(username: String!): User
    }
`;