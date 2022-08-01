import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query("getSecretMessage", {
    resolve({ ctx }) {
      return "He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.";
    },
  })
  .query("getAllChannels", {
    async resolve({ ctx }) {
      return await ctx.prisma.channel.findMany();
    }
  })
  .query("getChannelByUser", {
    input: z
      .object({
        userId: z.string(),
      }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.channel.findMany({
        where: { userId: input?.userId }
      })
    },
  })
  .mutation("createChannel", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (ctx.session.user.id) {
        return await ctx.prisma.channel.create({
          data: {
            name: input.name,
            userId: ctx.session.user.id,
            createdAt: new Date(),
          }
        })
      } else {
        return new TRPCError({ message: 'No User ID Found', code: 'NOT_FOUND' })
      }
    }
  });
