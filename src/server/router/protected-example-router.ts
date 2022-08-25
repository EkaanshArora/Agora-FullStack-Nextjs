import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "../../env/server.mjs";
import { createProtectedRouter } from "./protected-router";
import { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } from 'agora-access-token';

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  // .query("getSecretMessage", {
  //   resolve({ ctx }) {
  //     return "He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.";
  //   },
  // })
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
  })
  .query("getToken", {
    input: z.object({
      channelName: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (ctx.session.user.id) {
        const user = await ctx.prisma.user.findFirst({
          where: { id: ctx.session.user.id }
        })
        if (user?.agoraUid !== undefined) {
          let rtc = RtcTokenBuilder.buildTokenWithUid(env.APP_ID, env.APP_CERTIFICATE, input.channelName, user.agoraUid, RtcRole.PUBLISHER, Math.floor(Date.now() / 1000) + 6000);
          let rtm = RtmTokenBuilder.buildToken(env.APP_ID, env.APP_CERTIFICATE, String(user.agoraUid), RtmRole.Rtm_User, Math.floor(Date.now() / 1000) + 6000);
          return { rtc, rtm, uid: user?.agoraUid }
        } else throw new TRPCError({ message: 'No User ID Found', code: 'NOT_FOUND' })
      } else throw new TRPCError({ message: 'Test 2', code: 'NOT_FOUND' })
    }
  });
