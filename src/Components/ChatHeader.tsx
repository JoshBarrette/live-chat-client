import { useEffect, useRef, useState } from "react";
import { ConnectedUser } from "../lib/ChatSocket/types";
import useDelay from "../hooks/useDelay";

export default function ChatHeader({
  connectedUsers,
}: {
  connectedUsers: ConnectedUser[];
}) {
  return (
    <>
      <div className="grid w-full grid-cols-3 rounded-md bg-slate-300 text-center text-xl font-semibold">
        <a
          className="flex items-center justify-center rounded-l-md transition-all hover:bg-slate-400"
          href="https://github.com/JoshBarrette/live-chat-client"
        >
          GitHub
        </a>
        <h1 className="h-full bg-slate-400 py-2">Live Chat</h1>
        <UsersButtonAndList connectedUsers={connectedUsers} />
      </div>
    </>
  );
}

function UsersButtonAndList({
  connectedUsers,
}: {
  connectedUsers: ConnectedUser[];
}) {
  const usersRef = useRef<HTMLDivElement | null>(null);
  const usersButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showUsers, setShowUsers] = useState(false);
  const [scrollable] = useDelay([showUsers]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [usersRef]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      usersRef.current &&
      usersButtonRef.current &&
      !usersRef.current.contains(event.target as Node) &&
      !usersButtonRef.current.contains(event.target as Node)
    ) {
      setShowUsers(false);
    }
  };

  return (
    <>
      <button
        className={`rounded-r-md transition-all hover:bg-slate-400 ${showUsers ? "bg-slate-400" : ""}`}
        onClick={() => setShowUsers(!showUsers)}
        ref={usersButtonRef}
      >
        Online Users
      </button>
      <div
        className={`absolute top-[3.2rem] z-10 max-h-[80%] w-[494px] rounded-md bg-slate-400 text-left text-lg font-medium ${scrollable ? "overflow-y-auto" : "overflow-y-hidden"}`}
        style={{
          transition: `height 250ms ease-in-out`,
          height: showUsers ? usersRef.current?.scrollHeight : "0px",
        }}
        ref={usersRef}
      >
        <div className="space-y-2 p-2">
          {connectedUsers.length === 0 && (
            <p>
              <i>No Users Online...</i>
            </p>
          )}

          {connectedUsers.map((user, key) => (
            <div className="flex space-x-2" key={key + user.username}>
              <img
                className="max-h-8 rounded-full"
                src={user.picture}
                width="32"
                height="32"
              />
              <p className="my-auto">{user.username}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
