import AgoraUIKit from "agora-react-uikit";
import { useRouter } from "next/router";
import { env } from "../env/client.mjs";

import { trpc } from "../utils/trpc";

const Videocall = (props: { channel: string }) => {
  const router = useRouter()
  const q = trpc.useQuery(['auth.getToken', { channel: props.channel }])
  if (q.isLoading) return <p>joining...</p>
  if (q.isError) return <p>error</p>
  return (
    <>
      <h2>{props.channel}</h2>
      {JSON.stringify(q.data)}
      {q.isSuccess ?
        <div style={{ width: '100vw', height: '80vh', display: 'flex' }}>
          <AgoraUIKit
            rtcProps={{ appId: env.NEXT_PUBLIC_APP_ID, channel: props.channel, token: q.data.rtc, uid: q.data.agoraId }}
            rtmProps={{ token: q.data.rtm, uid: String(q.data.agoraId) }}
            callbacks={{
              EndCall: () => {
                router.push('/').then(() => { router.reload() })
              }
            }}
          />
        </div> : <></>
      }
    </>
  )

}

export default Videocall;
