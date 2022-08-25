import Head from "next/head";
import { useRouter } from 'next/router'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Denied from "../../components/denied";
import Loading from "../../components/loading";
const Videocall = dynamic(() => import("../../components/videocall"), { ssr: false })

const Call = () => {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!router.isReady) return;
    setReady(true)
  }, [router.isReady]);

  const { status } = useSession()

  if (status === "loading") {
    return <Loading />
  }

  if (status === "unauthenticated") {
    return <Denied />
  }

  return (
    <>
      <Head> </Head>
      <div className="flex flex-col flex-1 items-center text-center h-screen w-screen">
        {ready ?
          <>
            <h1 className="text-2xl font-bold">
              {router.query.name}
            </h1>
            <Videocall channel={router.query.channel as string} />
          </>
          : <></>
        }
      </div>
    </>
  );
};

export default Call;
