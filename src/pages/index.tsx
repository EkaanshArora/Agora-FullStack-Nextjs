import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const channels = trpc.useQuery(["question.getAllChannels"])
  const session = useSession()
  const router = useRouter()

  /**Reload the page to unmount the Videocall component to cleanup tracks */
  useEffect(() => {
    router.events.on('routeChangeComplete', router.reload)
    return () => {
      router.events.off('routeChangeComplete', router.reload)
    }
  }, [router])

  return (
    <>
      <Head>
        <title>Agora</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Typesafe Videocall
        </h1>
        <p className="text-2xl leading-normal font-extrabold text-gray-700">
          Select Channel
        </p>
        {session && session.data ?
          <>
            {channels.data ?
              <div>
                {channels.data.map(c =>
                  <Link href={`call/${c.id}?name=${c.name}`} key={c.id}>
                    <p className="text-blue-500 font-semibold cursor-pointer hover:underline">{c.name}</p>
                  </Link>
                )}
              </div>
              : <p>Loading..</p>}
            <Link href={'/create'}>
              <div className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">Create New</div>
            </Link>
            <div onClick={() => signOut()} className="m-4 underline text-blue-500 font-bold py-2 px-4 rounded cursor-pointer">Logout</div>
          </>
          :
          <div className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => signIn()}>Login</div>
        }
      </main>
    </>
  );
};


export default Home;
