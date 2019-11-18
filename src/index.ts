import express from "express";
import { ApolloServer } from "apollo-server-express";
import { importSchema } from "graphql-import";

import resolvers from "./resolvers";
import { context } from "./utils/context";

const app = express();

const typeDefs = importSchema("src/schemas/schema.graphql");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
  console.log(`server is up at http://localhost:4000${server.graphqlPath}`);
});
