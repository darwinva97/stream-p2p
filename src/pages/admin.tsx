import { useAdminSocket } from "@/hooks/useSocket";
import { useStore } from "@/store";
import { useEffect, useRef } from "react";

const Page = () => {
  const socket = useAdminSocket();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (socket) {
      socket.emit("init_stream");
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: { width: 1280, height: 720 },
        })
        .then((mediaStream) => {
          const video = videoRef.current!;
          video.srcObject = mediaStream;
          video.onloadedmetadata = () => {
            video.play();
          };
          function sendVideoToAPI(stream: MediaStream) {
            // Obtener un nuevo contexto de video para dibujar los frames de video capturados
            const canvas = canvasRef.current!
            const videoContext = canvas.getContext("2d")!;

            // Dibujar el video en el canvas
            videoContext.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Obtener los datos del canvas como una imagen en formato base64
            const imageData = canvas.toDataURL("image/jpeg");

            const peers = useStore.getState().peers;

            peers.forEach(peer => {
              console.log(peer)
              if (peer?.peer) {
                try {
                  peer?.peer?.send(imageData)
                } catch (error) {
                  console.error(error)
                }
              }
            })

            setTimeout(function () {
              sendVideoToAPI(stream);
            }, 100);
          }
          sendVideoToAPI(mediaStream)
        });
    }
  }, [socket]);

  return (
    <div>
      <h1>Page</h1>
      <canvas height={"720px"} width="1280px" ref={canvasRef}></canvas>
      <video ref={videoRef} controls></video>
    </div>
  );
};

export default Page;
