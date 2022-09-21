import { z } from "zod";
import { roomSchema } from "../../utils/validate";
import { createProtectedRouter } from "./context";
import {RtcRole, RtcTokenBuilder, RtmRole, RtmTokenBuilder} from 'agora-access-token';
import { trpc } from "../../utils/trpc";
import { TRPCError } from "@trpc/server";
import { env } from "../../env/server.mjs";
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
  .mutation("createRoom", {
    input: roomSchema,
    async resolve({ctx, input}) {
      console.log(ctx.prisma.room)
      return await ctx.prisma.room.create({
        data: {
          name: input.name,
          description: input.description,
          userId: ctx.session.user.id
        }
      })
    }
  })
  .query('getAllRooms', {
    async resolve({ctx}) {
      return await ctx.prisma.room.findMany()
    }
  })
  .query('getToken', {
    input: z.object({
      channel: z.string(),
    }),
    async resolve({ctx, input}) {
      const user = await ctx.prisma.user.findFirst({where: {id: ctx.session.user.id}})
      if(!user?.agoraId) {throw new TRPCError({code: "METHOD_NOT_SUPPORTED"})}
      const rtc = RtcTokenBuilder.buildTokenWithUid(env.APP_ID, env.APP_CERTIFICATE, input.channel, user.agoraId, RtcRole.PUBLISHER, (Math.floor(Date.now() / 1000) + 6000))
      const rtm = RtmTokenBuilder.buildToken(env.APP_ID, env.APP_CERTIFICATE, String(user.agoraId), RtmRole.Rtm_User, (Math.floor(Date.now() / 1000) + 6000)) 
      return {rtc, rtm, agoraId: user.agoraId}
    }
  })
