import { FormEvent, useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import { ChatSocket } from "../lib/ChatSocket";

export default function Chat() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState<string[]>([]);
  const [, setConnectedUsers] = useState<string[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const socket = ChatSocket.getInstance((s: string) => {
    setMessages([...messages, s]);
  }, setConnectedUsers);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function handleForm(e: FormEvent) {
    e.preventDefault();

    if (!user) return;

    socket.sendMessage({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      },
      message: inputRef.current?.value ?? "no input ref :)",
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollButton(!(scrollTop + clientHeight >= scrollHeight));
  }

  function scrollToBottom() {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }

  return (
    <div className="container mx-auto flex h-screen flex-col text-lg">
      <div className="m-auto flex h-full w-[30rem] flex-col items-center justify-center">
        <div className="relative flex h-3/4 w-full flex-col">
          <div
            id="chatBox"
            ref={chatBoxRef}
            className="mx-auto flex h-full w-full flex-col overflow-y-auto break-all rounded bg-slate-200 px-4 py-2"
            onScroll={handleScroll}
          >
            <button
              className={`absolute bottom-2 right-6 size-7 rounded-full bg-blue-300 transition-all hover:bg-blue-400 ${showScrollButton ? "scale-100" : "scale-0"}`}
              onClick={scrollToBottom}
            >
              V
            </button>
            {messages.map((message, key) => (
              <p key={key + message}>{message}</p>
            ))}
          </div>
        </div>

        <form onSubmit={handleForm} className="mx-auto mt-4 w-full space-y-4">
          <input
            className="w-full rounded border border-neutral-300 bg-neutral-200 p-1 text-xl placeholder:text-neutral-400 focus:border-blue-300 focus:outline-none"
            placeholder="Type a Message"
            ref={inputRef}
            disabled={!isSignedIn}
          />
          <span className="flex space-x-4">
            <SendMessageButton isSignedIn={isSignedIn} />
            {isSignedIn && (
              <img
                src={user?.picture}
                alt="pfp"
                className="my-auto size-12 rounded-full bg-slate-600"
              />
            )}
          </span>
        </form>
      </div>

      {/* <div id="usersBox">
        {connectedUsers.length > 0 && <p>Connected Users:</p>}

        {connectedUsers.map((user, key) => (
          <p key={key + user}>{user}</p>
        ))}
      </div> */}
    </div>
  );
}

function SendMessageButton({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <>
      <button
        className="max-w-full flex-grow rounded bg-blue-300 py-2 transition-all hover:bg-blue-400 disabled:bg-blue-900 disabled:text-white"
        disabled={!isSignedIn}
        type="submit"
      >
        {isSignedIn ? "Send Message" : "Sign in to Chat!"}
      </button>
    </>
  );
}
