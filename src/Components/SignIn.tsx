import { FormEvent, useRef } from "react";
import { useSocket } from "../Socket";
import useUser from "../hooks/useUser";

export default function SignIn() {
  const { setUsername } = useSocket();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isLoaded, isSignedIn, signOut } = useUser();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inputRef.current?.value === "" || !inputRef.current) {
      return;
    }

    setUsername(inputRef.current.value);
  }

  return (
    <div>
      {isLoaded ? "loaded" : "loading"}
      {isSignedIn ? "signed in" : "not signed in"}

      <button onClick={() => signOut()}>sign out</button>

      <form onSubmit={handleSubmit}>
        <label htmlFor="usernameInput">Choose a Username</label>
        <input id="usernameInput" ref={inputRef} />
        <button>Select Username</button>
      </form>
    </div>
  );
}
