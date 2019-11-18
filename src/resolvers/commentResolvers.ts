import { Context } from "../utils/context";
import { getUserId } from "../utils/getUserId";

interface Comment {
  id: string;
  text: string;
}

interface CommentExist extends Context {
  commentId: string;
}

const isExistComment: (data: CommentExist) => Promise<void> = async ({
  request,
  prisma,
  commentId
}) => {
  const userId = getUserId(request);
  const isMatch = await prisma.$exists.comment({
    id: commentId,
    author: { id: userId }
  });
  if (!isMatch) throw new Error("Comment not found");
};

export const resolvers = {
  Query: {
    comments(parent: never, args, { prisma }: Context, info: never) {
      const opArgs = {
        after: args.after,
        skip: args.skip,
        first: args.frist,
        orderBy: args.orderBy
      };
      return prisma.comments(opArgs);
    }
  },
  Mutation: {
    createComment(
      parent: never,
      { data },
      { prisma, request }: Context,
      info: never
    ) {
      const userId = getUserId(request);

      return prisma.createComment({
        text: data.text,
        author: {
          connect: {
            id: userId
          }
        },
        post: {
          connect: {
            id: data.post
          }
        }
      });
    },
    async updateComment(
      parent: never,
      { id, data },
      ctx: Context,
      info: never
    ) {
      await isExistComment({ ...ctx, commentId: id });
      return ctx.prisma.updateComment({
        where: { id },
        data
      });
    },
    async deleteComment(parent: never, { id }, ctx: Context, info: never) {
      await isExistComment({ ...ctx, commentId: id });
      // delete only retur scalar filed
      return ctx.prisma.deleteComment({ id });
    }
  },
  Comment: {
    author(parent: Comment, args: never, { prisma }: Context, info: never) {
      return prisma.comment({ id: parent.id }).author();
    },
    post(parent: Comment, args: never, { prisma }: Context, info: never) {
      return prisma.comment({ id: parent.id }).post();
    }
  }
};
