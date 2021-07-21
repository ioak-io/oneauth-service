const { gql, AuthenticationError } = require("apollo-server-express");
const GraphQLJSON = require("graphql-type-json");

const typeDefs = gql`
  scalar JSON
`;

const resolvers = {
  JSON: GraphQLJSON,
};

module.exports = { typeDefs, resolvers };
