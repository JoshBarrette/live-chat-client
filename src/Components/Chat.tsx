import { FormEvent, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import UserButton from "./UserButton";
import SendMessageButton from "./SendMessageButton";
import ChatBox from "./ChatBox";
import { ChatSocket } from "../lib/ChatSocket";

export interface ChatMessage {
  username: string;
  content: string;
  picture: string;
}

export default function Chat() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [error, setError] = useState<boolean>(false);
  const socket = ChatSocket.getInstance({
    messageSetter: (newMessages: ChatMessage[]) => {
      setMessages([...messages, ...newMessages]);
    },
    connectedUsersSetter: setConnectedUsers,
    errorSetter: setError,
  });

  function handleForm(e: FormEvent) {
    e.preventDefault();

    if (!user || !inputRef.current) return;

    socket.sendMessage({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      },
      message: inputRef.current.value,
    });

    inputRef.current.value = "";
  }

  return (
    <>
      <div className="container mx-auto flex h-screen flex-col text-lg">
        <div className="m-auto flex h-full w-[30rem] flex-col items-center justify-center">
          <ChatBox messages={messages} connectedUsers={connectedUsers} />

          <ChatForm action={handleForm} inputRef={inputRef} />
        </div>
      </div>

      {error && <ErrorWindow />}
    </>
  );
}

function ErrorWindow() {
  const [showWindow, setShowWindow] = useState(true);

  return (
    <>
      {showWindow && (
        <div className="fixed rounded top-10 left-10 bg-red-600">
          <button
            className="absolute top-2 right-4 font-bold"
            onClick={() => setShowWindow(false)}
          >
            X
          </button>
          <h2 className="text-black text-2xl p-10">
            Unable to Connect to Backend
          </h2>
        </div>
      )}
    </>
  );
}

function ChatForm({
  action,
  inputRef,
}: {
  action: (e: FormEvent) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}) {
  const { isSignedIn } = useUser();

  return (
    <form onSubmit={action} className="mx-auto w-full">
      <input
        className="w-full border border-slate-200 p-1 text-xl placeholder:text-neutral-400 focus:outline-none disabled:bg-white"
        placeholder="Send a Message"
        ref={inputRef}
        disabled={!isSignedIn}
      />
      <span className="flex">
        <SendMessageButton />
        <UserButton />
      </span>
    </form>
  );
}
