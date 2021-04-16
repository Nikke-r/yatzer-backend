import { gql } from 'apollo-server-express';
import gameDefs from './gameDefs';
import userDefs from './userDefs';

const linkDefs = gql`
    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }

    type Subscription {
        _: Boolean
    }
`;

export default [
    linkDefs,
    userDefs,
    gameDefs,
];