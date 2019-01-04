import { ResolverMap } from "../../types/graphql-utils.d";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }) => `Bye ${name || 'World'}`
  },
};
