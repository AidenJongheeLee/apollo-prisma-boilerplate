import { Context } from "../utils/context";
import { hashPassword } from "../utils/hashPassword";
import { getUserId } from "../utils/getUserId";
import { generateToken } from "../utils/generateToken";

interface UserInput {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export const resolvers = {
  Query: {
    users(parent: never, args, { prisma }: Context) {
      return prisma.users();
    }
  },
  Mutation: {
    async createUser(
      parent: never,
      { data }: { data: UserInput },
      { prisma }: Context
    ) {
      const password = await hashPassword(data.password);

      const user = await prisma.createUser({ ...data, password });
      return {
        user,
        token: generateToken(user.id)
      };
    },
    async updateUser(
      parent: never,
      { data }: { data: UserInput },
      { prisma, request }: Context
    ) {
      const userId = getUserId(request);

      if (typeof data.password === "string") {
        data.password = await hashPassword(data.password);
      }

      return prisma.updateUser({
        data: data,
        where: {
          id: userId
        }
      });
    },
    deleteUser(
      parent: never,
      args: never,
      { prisma, request }: Context,
      info: never
    ) {
      const userId = getUserId(request);
      // delete only retur scalar filed
      return prisma.deleteUser({ id: userId });
    }
  },
  User: {
    email(
      parent: User,
      args: never,
      { prisma, request }: Context,
      info: never
    ) {
      const userId = getUserId(request, false);
      if (parent.id === userId) {
        return parent.email;
      } else {
        return null;
      }
    },
    posts(parent: User, args: never, { prisma }: Context) {
      return prisma.user({ id: parent.id }).posts({
        where: {
          published: true,
          author: { id: parent.id }
        }
      });
    },
    comments(parent: User, args: never, { prisma }: Context, info: never) {
      return prisma.user({ id: parent.id }).comments();
    }
  }
};
