import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./Chat";

export default function ChatBox({
  messages,
  connectedUsers,
}: {
  messages: ChatMessage[];
  connectedUsers: string[];
}) {
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="relative flex h-3/4 w-full flex-col">
      <ChatHeader connectedUsers={connectedUsers} />

      <div
        ref={chatBoxRef}
        className="mx-auto flex h-full w-full flex-col overflow-y-auto break-all rounded-b bg-slate-200"
        onScroll={handleScroll}
      >
        <button
          className={`absolute bottom-2 right-6 px-2 rounded-full bg-blue-300 transition-all hover:bg-blue-400 ${showScrollButton ? "scale-100" : "scale-0"}`}
          onClick={scrollToBottom}
        >
          Scroll to Bottom
        </button>
        
        <MessagesList messages={messages} />
      </div>
    </div>
  );
}

function ChatHeader({ connectedUsers }: { connectedUsers: string[] }) {
  const usersRef = useRef<HTMLDivElement | null>(null);
  const [showUsers, setUsers] = useState(false);

  return (
    <>
      <div className="w-full grid grid-cols-3 bg-slate-300 text-center rounded-t text-xl font-semibold">
        <a
          className="flex items-center justify-center hover:bg-slate-400 transition-all rounded-tl"
          href="https://github.com/JoshBarrette/live-chat-client"
        >
          GitHub
        </a>
        <h1 className="py-2 bg-slate-400 h-full">Live Chat</h1>
        <button
          className={`hover:bg-slate-400 transition-all rounded-tr ${showUsers ? "bg-slate-400" : ""}`}
          onClick={() => setUsers(!showUsers)}
        >
          Online Users
        </button>
      </div>

      <div
        className="absolute bg-slate-400 w-[30rem] max-h-[80%] top-11 overflow-y-auto"
        style={{
          transition: "height 250ms ease-in-out",
          height: showUsers ? usersRef.current?.scrollHeight : "0px",
        }}
        ref={usersRef}
      >
        <div className="m-2">
          {connectedUsers.length > 0 && <p>Connected Users:</p>}

          {connectedUsers.map((user, key) => (
            <p key={key + user}>{user}</p>
          ))}
        </div>
      </div>
    </>
  );
}

function MessagesList({ messages }: { messages: ChatMessage[] }) {
  return (
    <span>
      {messages.map((message, key) => (
        <div
          className="flex space-x-1 my-1 first:mt-2 last:mb-0 hover:bg-slate-300 p-2 transition-all"
          key={key + message.content}
        >
          <img
            className="rounded-full"
            src={message.picture}
            width="32"
            height="32"
          />
          <p>
            <b>{message.username}:</b> {message.content}
          </p>
        </div>
      ))}
    </span>
  );
}
