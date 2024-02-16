import { FormEvent, useRef } from "react";
import { useSocket } from "../Socket";

export default function Chat() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { socket, messages, username } = useSocket();

  function handleForm(e: FormEvent) {
    e.preventDefault();

    socket.emit("send_message", {
      username: username!,
      message: inputRef?.current?.value ?? "",
    });
  }

  return (
    <>
      <form onSubmit={handleForm}>
        <input ref={inputRef} />
        <button>send message</button>
      </form>

      {messages.map((message, key) => (
        <p key={key}>{message}</p>
      ))}
    </>
  );
}
