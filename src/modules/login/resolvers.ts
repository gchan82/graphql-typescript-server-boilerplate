
import * as bcrypt from 'bcryptjs';

import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { confirmEmailError } from './errorMessages';

const errorResponse = [
  {
    path: "email",
    message: "invalid login",
  }
]

export const resolvers: ResolverMap = {
  Query: {
    bye2: () => 'bye'
  },

  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return errorResponse;
      }

      if(!user.confirmed){
        return [{
          path: "email",
          message: confirmEmailError
        }];
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return errorResponse;
      }

      return null;
    }
  }
};
