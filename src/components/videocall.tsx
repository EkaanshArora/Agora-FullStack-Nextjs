import React, { useEffect } from "react";
import { trpc } from '../utils/trpc';
import UIKit from "agora-react-uikit";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AgoraRTC from "agora-rtc-sdk-ng";
AgoraRTC.setLogLevel(4)

const Videocall = (props: { channel: string }) => {
  const q = trpc.useQuery(['question.getToken', { channelName: props.channel }])
  const router = useRouter()
  const session = useSession()

  return (
    <div className="flex-1 flex w-screen">
      {
        q.isFetched ?
          <UIKit rtcProps={{ appId: 'c0c4e9a283a9450aac1a66f2cf980a7a', channel: props.channel, uid: q.data?.uid, token: q.data?.rtc, layout: 0 }}
            rtmProps={{ token: q.data?.rtm, uid: String(q.data?.uid), displayUsername: true, username: session.data?.user?.name! }}
            callbacks={{ EndCall: () => router.replace('/') }}
          />
          : <></>
      }
    </div>

  )
}

export default Videocall;
