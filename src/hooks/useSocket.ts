import { TSocket, useStore } from "@/store";
import { initPeer } from "@/utils/peer";
import { useEffect } from "react";

export const useSocket = (callback?: (socket: TSocket) => void) => {
  const { setSocket, socket } = useStore();

  useEffect(() => {
    const fn = async () => {
      const socketModule = await import("socket.io-client").then(
        (m) => m.default
      );
      const socket = socketModule(
        "https://3b82-2800-200-e390-b9b-204e-d697-9aa5-c3d0.ngrok-free.app"
      ) as unknown as TSocket;
      if (callback) callback(socket);
      setSocket(socket);
    };
    fn();
  }, []);

  return socket;
};

export const useClientSocket = () => {
  const { initClientPeer } = useStore();

  useEffect(() => {
    const fn = async () => {
      const peer = await initPeer();
      initClientPeer(peer);
    };
    fn();
  }, []);

  const socket = useSocket((socket) => {
    socket.on("send_answer_toclient", (data) => {
      const peer = useStore.getState().peer;
      peer?.signal(data);
    });
  });

  return socket;
};

export const useAdminSocket = () => {
  const { addToPeers } = useStore();
  const socket = useSocket((socket) => {
    socket.on("new_offer", async ({ socketId, data: peerData }) => {
      const peer = await initPeer(peerData);
      addToPeers({ socketId, peer });
      peer.signal(peerData);
    });
  });

  return socket;
};
