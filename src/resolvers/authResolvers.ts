import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import { Context } from "../utils/context";
import { getUserId } from "../utils/getUserId";

export const resolvers = {
  Query: {
    me(parent: never, args: never, { prisma, request }: Context, info: never) {
      const userId = getUserId(request);
      if (!userId) throw new Error("Login required");
      return prisma.user({ id: userId });
    }
  },
  Mutation: {
    async login(
      parent: never,
      { email, password }: { email: string; password: string },
      { prisma }: Context,
      info: never
    ) {
      const user = await prisma.user({ email });
      if (!user) throw new Error("Unable to login");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Unable to login");
      return {
        user,
        token: generateToken(user.id)
      };
    }
  }
};
