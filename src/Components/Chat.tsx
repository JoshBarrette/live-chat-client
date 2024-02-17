import { FormEvent, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import { ChatSocket } from "../lib/ChatSocket";
import { Link } from "react-router-dom";

export default function Chat() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { user, isSignedIn, signOut } = useUser();
  const [messages, setMessages] = useState<string[]>([]);
  const socket = ChatSocket.getInstance((s: string) => {
    setMessages([...messages, s]);
  });

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
  }

  return (
    <>
      <form onSubmit={handleForm}>
        <input ref={inputRef} />
        <button disabled={!isSignedIn} type="submit">
          send message
        </button>

        {isSignedIn ? (
          <button onClick={signOut}>sign out</button>
        ) : (
          <button>
            <Link to={`${process.env.REACT_APP_API_URL}/auth/google/login`}>
              sign in
            </Link>
          </button>
        )}
      </form>

      <button onClick={() => setMessages([])}>clear messages</button>

      <div id="chatBox">
        {messages.map((message, key) => (
          <p key={key + message}>{message}</p>
        ))}
      </div>
    </>
  );
}
