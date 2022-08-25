import { signIn } from "next-auth/react";
import React from "react";

const Denied = () => {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
        Typesafe Videocall
      </h1>
      <p className="text-2xl leading-normal font-extrabold text-gray-700">
        You're not authorized.
      </p>

      <div className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => signIn()}>Login</div>
    </main>
  )
}

export default Denied;
