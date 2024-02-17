import { FormEvent, useRef } from "react";
import { useSocket } from "../Socket";

export default function SignIn() {
  const { setUsername } = useSocket();
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inputRef.current?.value === "" || !inputRef.current) {
      return;
    }

    setUsername(inputRef.current.value);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="usernameInput">Choose a Username</label>
        <input id="usernameInput" ref={inputRef} />
        <button>Select Username</button>
      </form>
    </div>
  );
}
