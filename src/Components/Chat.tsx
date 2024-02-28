import { FormEvent, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import UserButton from "./UserButton";
import SendMessageButton from "./SendMessageButton";
import ChatBox from "./ChatBox";
import useChat from "../hooks/useChat";

export default function Chat() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useUser();
  const { messages, connectedUsers, showError, socket } = useChat();

  function handleForm(e: FormEvent) {
    e.preventDefault();

    if (!user || !inputRef.current) return;

    socket?.sendMessage({
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
        <div className="m-auto flex h-[90%] w-[32rem] flex-col space-y-2 rounded-md border shadow-2xl shadow-neutral-400 border-neutral-300 bg-white p-2">
          <ChatBox messages={messages} connectedUsers={connectedUsers} />

          <ChatForm action={handleForm} inputRef={inputRef} />
        </div>
      </div>

      {showError && <ErrorWindow />}
    </>
  );
}

function ErrorWindow() {
  const [showWindow, setShowWindow] = useState(true);

  return (
    <>
      {showWindow && (
        <div className="fixed left-10 top-10 rounded-md bg-red-600">
          <button
            className="absolute right-4 top-2 font-bold"
            onClick={() => setShowWindow(false)}
          >
            X
          </button>
          <h2 className="p-10 text-2xl text-black">
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
    <form onSubmit={action} className="mx-auto w-full space-y-2">
      <input
        className="w-full rounded-md border border-neutral-300 p-1 text-xl ring-0 ring-indigo-600 transition-all placeholder:text-neutral-400 focus:outline-none focus:ring disabled:bg-neutral-400 disabled:placeholder:text-neutral-600"
        placeholder="Send a Message"
        ref={inputRef}
        disabled={!isSignedIn}
      />
      <span className="flex space-x-2">
        <SendMessageButton />
        <UserButton />
      </span>
    </form>
  );
}
