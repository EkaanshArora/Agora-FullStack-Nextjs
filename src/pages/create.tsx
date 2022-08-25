import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Denied from "../components/denied";
import Loading from "../components/loading";
import { trpc } from "../utils/trpc";

const Create = () => {
  const [channel, setChannel] = useState('')
  const createChannel = trpc.useMutation(["question.createChannel"])
  const router = useRouter()

  useEffect(() => {
    if (createChannel.isSuccess) {
      router.push('/')
    }
  }, [createChannel.isSuccess, router])

  const { status } = useSession()

  if (status === "loading") {
    return <Loading />
  }

  if (status === "unauthenticated") {
    return <Denied />
  }

  return (
    <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
      {/* <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700"> Agora <span className="text-purple-300">Demo</span> </h1> */}
      <h3 className="text-xl md:text-[5rem] leading-normal font-extrabold text-gray-700">Create Channel</h3>
      <input className="m-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" type="text" value={channel} onChange={(e) => setChannel(e.target.value)}></input>
      <div className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={async () => {
        await createChannel.mutate({ name: channel })
      }}>Create</div>
      <p>Status: {createChannel?.status}</p>
      <p>Data: {createChannel?.data?.name}</p>
      <p>Error: {createChannel?.error?.message}</p>

      <div onClick={() => router.push('/')} className="m-4 underline text-blue-500 font-bold py-2 px-4 rounded cursor-pointer">Back</div>
    </main>
  )
}

export default Create;
