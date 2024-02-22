import { FormEvent, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import { ChatSocket } from "../lib/ChatSocket";
import { Link } from "react-router-dom";

export default function Chat() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { user, isSignedIn, signOut } = useUser();
  const [messages, setMessages] = useState<string[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const socket = ChatSocket.getInstance((s: string) => {
    setMessages([...messages, s]);
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
    <>
      <form onSubmit={handleForm}>
        <input ref={inputRef} disabled={!isSignedIn} />
        <button disabled={!isSignedIn} type="submit">
          send message
        </button>
      </form>

      {isSignedIn ? (
        <button onClick={signOut}>sign out</button>
      ) : (
        <button>
          <Link to={`${import.meta.env.VITE_APP_API_URL}/auth/google/login`}>
            sign in
          </Link>
        </button>
      )}

      <button onClick={() => setMessages([])}>clear messages</button>

      <div id="chatBox">
        {messages.length > 0 && <p>Chat:</p>}

        {messages.map((message, key) => (
          <p key={key + message}>{message}</p>
        ))}
      </div>

      <div id="usersBox">
        {connectedUsers.length > 0 && <p>Connected Users:</p>}

        {connectedUsers.map((user, key) => (
          <p key={key + user}>{user}</p>
        ))}
      </div>
    </>
  );
}
