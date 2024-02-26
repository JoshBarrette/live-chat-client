import { useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import { ChatMessage, ConnectedUser } from "../lib/ChatSocket/types";
import ChatHeader from "./ChatHeader";

export default function ChatBox({
  messages,
  connectedUsers,
}: {
  messages: ChatMessage[];
  connectedUsers: ConnectedUser[];
}) {
  const { isLoaded } = useUser();
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
    <div className="relative flex h-full w-full flex-col space-y-2">
      <ChatHeader connectedUsers={connectedUsers} />

      <div
        ref={chatBoxRef}
        className="mx-auto flex h-full w-full flex-col overflow-y-auto break-all rounded-md bg-indigo-100"
        onScroll={handleScroll}
      >
        {!isLoaded && (
          <p className="mt-5 text-center text-xl font-semibold">
            Connecting...
          </p>
        )}

        <button
          className={`absolute bottom-2 right-6 rounded-full bg-indigo-300 px-2 transition-all hover:bg-indigo-400 ${showScrollButton ? "scale-100" : "scale-0"}`}
          onClick={scrollToBottom}
        >
          Scroll to Bottom
        </button>

        <MessagesList messages={messages} />
      </div>
    </div>
  );
}

function MessagesList({ messages }: { messages: ChatMessage[] }) {
  return (
    <span>
      {messages.map((message, key) => (
        <div
          className="my-1 flex space-x-1 p-2 transition-all first:mt-2 last:mb-0 hover:bg-slate-300"
          key={key + message.content}
        >
          <img
            className="max-h-8 rounded-full"
            src={message.picture}
            width="32"
            height="32"
          />
          <p className="my-auto">
            <b>{message.username}:</b> {message.content}
          </p>
        </div>
      ))}
    </span>
  );
}
