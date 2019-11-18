import { Context } from "../utils/context";
import { getUserId } from "../utils/getUserId";

interface PostInput {
  title: string;
  body: string;
  published: boolean;
}

interface PostExists extends Context {
  postId: string;
}

const isExistPost: (data: PostExists) => Promise<void> = async ({
  request,
  prisma,
  postId
}) => {
  const userId = getUserId(request);
  const postExists = await prisma.$exists.post({
    id: postId,
    author: { id: userId }
  });
  if (!postExists) throw new Error("Post not found");
};

export const resolvers = {
  Query: {
    posts(parent: never, args, { prisma, request }: Context, info: never) {
      const userId = getUserId(request, false);
      const opArgs = {
        first: args.first,
        after: args.after,
        skip: args.skip,
        orderBy: args.orderBy
      } as any;
      if (args.community) {
        opArgs.where = {
          AND: [{ published: true }, { author: { id_not: userId } }]
        };
      } else if (userId) {
        opArgs.where = {
          OR: [
            {
              author: { id: userId }
            },
            { published: true }
          ]
        };
      } else {
        opArgs.where = { published: true };
      }
      return prisma.posts(opArgs);
    },
    myPosts(parent: never, args, { prisma, request }: Context, info: never) {
      const userId = getUserId(request);
      const opArgs = {
        first: args.first,
        after: args.after,
        skip: args.skip,
        where: { author: { id: userId } }
      };
      return prisma.posts(opArgs);
    }
  },
  Mutation: {
    createPost(
      parent: never,
      { data }: { data: PostInput },
      { prisma, request }: Context,
      info: never
    ) {
      const userId = getUserId(request);
      return prisma.createPost({
        title: data.title,
        body: data.body,
        published: data.published,
        author: {
          connect: {
            id: userId
          }
        }
      });
    },
    async updatePost(
      parent: never,
      { id, data }: { id: string; data: PostInput },
      { prisma, request }: Context,
      info: never
    ) {
      await isExistPost({ request, prisma, postId: id });

      return prisma.updatePost({
        where: { id },
        data
      });
    },
    async deletePost(
      parent: never,
      { id }: { id: string },
      { prisma, request }: Context,
      info: never
    ) {
      await isExistPost({ request, prisma, postId: id });
      // // delete only retur scalar filed
      return prisma.deletePost({ id });
    }
  },
  Post: {
    author(parent, args, { prisma }: Context, info) {
      return prisma.post({ id: parent.id }).author();
    },
    comments(parent, args: never, { prisma }: Context, info: never) {
      return prisma.post({ id: parent.id }).comments();
    }
  }
};
