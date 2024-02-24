import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./Chat";

export default function ChatBox({ messages }: { messages: ChatMessage[] }) {
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
      <div
        ref={chatBoxRef}
        className="mx-auto flex h-full space-y-2 w-full flex-col overflow-y-auto break-all rounded bg-slate-200 px-4 py-2"
        onScroll={handleScroll}
      >
        <button
          className={`absolute bottom-2 right-6 size-7 rounded-full bg-blue-300 transition-all hover:bg-blue-400 ${showScrollButton ? "scale-100" : "scale-0"}`}
          onClick={scrollToBottom}
        >
          V
        </button>
        {messages.map((message, key) => (
          <div className="flex space-x-1" key={key + message.content}>
            <img
              className="rounded-full size-8"
              src={message.picture}
              width="30"
              height="30"
            />
            <p>
              <b>{message.username}:</b> {message.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
