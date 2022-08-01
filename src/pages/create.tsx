import React, { useState } from "react";
import { trpc } from "../utils/trpc";

const Create = () => {
  const [channel, setChannel] = useState('')
  const createChannel = trpc.useMutation(["question.createChannel"])
  return (
    <div>
      <div>Create Channel</div>
      <input type="text" value={channel} onChange={(e) => setChannel(e.target.value)}></input>
      <div onClick={async () => {
        await createChannel.mutate({ name: channel })
      }}>Create</div>
      <p>{createChannel?.isError + ' ' + createChannel?.isSuccess + createChannel?.isLoading}</p>
    </div>
  )
}

export default Create;
