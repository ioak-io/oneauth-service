import jwt from "jsonwebtoken";
import { gql, AuthenticationError } from "apollo-server-express";
import { userSchema, userCollection } from "./model";
import { getCollection } from "../../lib/dbutils";

const typeDefs = gql`
  type Query {
    users: [User]!
  }

  type Mutation {
    createEmailAccount(payload: UserPayload): User!
  }

  input UserPayload {
    given_name: String!
    family_name: String!
    email: String!
  }

  type User {
    id: ID!
    given_name: String
    family_namee: String
    email: String
    resolver: String
  }
`;

const resolvers = {
  Query: {
    users: async (_: any, { email }: any, { asset, user }: any) => {
      if (!asset || !user) {
        return new AuthenticationError("Not authorized to access this content");
      }
      const model = getCollection(asset, userCollection, userSchema);
      return await model.find();
    },
  },

  Mutation: {
    createEmailAccount: async (_: any, args: any, { asset, user }: any) => {
      const model = getCollection(asset, userCollection, userSchema);
      const response = await model.findOneAndUpdate(
        { email: args.payload.email, resolver: "email" },
        { ...args.payload, resolver: "email" },
        { upsert: true, new: true, rawResult: true }
      );
      return response.value;
    },
  },
};

export { typeDefs, resolvers };
