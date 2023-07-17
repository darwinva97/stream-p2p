import { TPeer, useStore } from "@/store";

export const initPeer = async (peerData?: TPeer) => {
  const SimplePeer = await import("simple-peer").then((m) => m.default);
  const p = new SimplePeer({
    initiator: !peerData, // initiator
    trickle: false,
  });

  p.on("error", (err) => console.log("error", err));

  p.on("signal", (data) => {
    const { socket, peers } = useStore.getState();
    if (!peerData) {
      // initiator (cliente)
      socket?.emit("send_offer", data);
      return;
    }
    // (admin)
    const peerDataFound = peers.find((peerData) => peerData.peer === p);
    const socketId = peerDataFound?.socketId;
    if (!socketId) return;
    socket?.emit("send_answer_toserver", { data, socketId });
  });

  p.on("connect", () => {
    console.log("CONNECT");
  });

  p.on("data", (data) => {
    const { setImgStream } = useStore.getState();
    setImgStream(data);
  });

  return p;
};
