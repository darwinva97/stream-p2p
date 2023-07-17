import { Server } from "socket.io";

const io = new Server(3030, {
  cors: {
    origin: "*",
  },
});

type TStreamerPeer = {
  socketId: string;
};

type TPeer = {
  offerData: any;
  streamerData: any;
};

type TData = {
  streamer: TStreamerPeer | null;
  peers: {
    [socketId: string]: TPeer;
  };
};

const data: TData = {
  streamer: null,
  peers: {},
};

io.on("connection", (socket) => {
  socket.on("init_stream", () => {
    console.log("init stream");
    data.streamer = {
      socketId: socket.id,
    };
  });
  socket.on("send_offer", (payloadResponse) => {
    const streamerSocketId = data.streamer?.socketId;
    console.log("send_offer initiated");
    if (!streamerSocketId) return;
    const peerPayload = { socketId: socket.id, data: payloadResponse };
    // const peerData = {
    //   offerData: data,
    //   streamerData: null,
    // };
    // data.peers[socket.id] = peerData;
    socket.to(streamerSocketId).emit("new_offer", peerPayload);
    console.log("send_offer emitted");
  });
  socket.on("send_answer_toserver", ({ data, socketId }) => {
    console.log("send_answer_toserver initiated");
    socket.to(socketId).emit("send_answer_toclient", data);
    console.log("send_answer_toserver emitted");
  });
});
