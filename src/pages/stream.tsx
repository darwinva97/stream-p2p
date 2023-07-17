import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";

const StreamPage = () => {
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;
    socket.on("stream", (data) => {
      console.log(data);
    });
  }, [socket])
  return (
    <div>
      <h1>StreamPage</h1>
    </div>
  );
};

export default StreamPage;
