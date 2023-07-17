import type SimplePeer from "simple-peer";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { create } from "zustand";

export type TSocket = Socket<DefaultEventsMap, DefaultEventsMap>;

export type TSocketId = string;

export type TPeer = {
  socketId: TSocketId;
  peer: SimplePeer.Instance;
}

export type TStore = {
  socket: TSocket | null;
  peers: TPeer[];
  peer: null | SimplePeer.Instance;
  initClientPeer: (peer: SimplePeer.Instance) => void;
  setSocket: (socket: Socket | null) => void;
  addToPeers: (payload: TPeer) => void;
  imgStream: string;
  setImgStream: (imgStream: string) => void;
};

export const useStore = create<TStore>((set) => ({
  socket: null,
  peers: [],
  peer: null,
  imgStream: "",
  setImgStream: (imgStream: string) => set({ imgStream }),
  initClientPeer: (peer: SimplePeer.Instance) => set({ peer }),
  setSocket: (socket: TSocket | null) => set({ socket }),
  addToPeers: (payload: TPeer) => set(store => {
    const peers = store.peers.concat(payload);
    return {
      ...store,
      peers,
    }
  })
}));
