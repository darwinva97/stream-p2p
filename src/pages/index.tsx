import { useClientSocket } from "@/hooks/useSocket";
import { useStore } from "@/store";

const Page = () => {
  const { imgStream } = useStore();
  useClientSocket();

  return (
    <div>
      <h1>Page</h1>
      <img src={imgStream} alt="" />
    </div>
  )
}

export default Page