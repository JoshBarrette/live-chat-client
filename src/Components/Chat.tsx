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
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const socket = ChatSocket.getInstance((newMessage: ChatMessage) => {
    setMessages([...messages, newMessage]);
  }, setConnectedUsers);

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

  return (
    <div className="container mx-auto flex h-screen flex-col text-lg">
      <div className="m-auto flex h-full w-[30rem] flex-col items-center justify-center">
        <ChatBox messages={messages} />

        <form onSubmit={handleForm} className="mx-auto mt-4 w-full space-y-4">
          <input
            className="w-full rounded border border-neutral-300 bg-neutral-200 p-1 text-xl placeholder:text-neutral-400 focus:border-blue-300 focus:outline-none"
            placeholder="Type a Message"
            ref={inputRef}
            disabled={!isSignedIn}
          />
          <span className="flex space-x-4">
            <SendMessageButton />
            <UserButton />
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
