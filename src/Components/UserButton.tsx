import { useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import { Button } from "./Button";

export default function UserButton() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { user, isSignedIn, signOut } = useUser();
  const [showOpts, setShowOpts] = useState(false);

  function toggleShowOpts() {
    setShowOpts(!showOpts);
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      contentRef.current &&
      !contentRef.current.contains(event.target as Node)
    ) {
      setShowOpts(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contentRef]);

  if (!isSignedIn) return null;

  return (
    <div className="relative" ref={contentRef}>
      <button
        className={`rounded-br flex transition-all ring-blue-400 ${showOpts ? "ring" : "ring-0"}`}
      >
        <img
          src={user?.picture}
          alt="profile picture"
          className="rounded-br bg-slate-600"
          onClick={toggleShowOpts}
          width="48"
          height="48"
        />
      </button>
      <div
        className={`absolute border transition-all w-48 bg-white rounded p-0.5 border-neutral-500 right-2 -top-2 z-40 -translate-y-full ${showOpts ? "scale-100" : "scale-0"}`}
      >
        <Button
          className="rounded-none whitespace-nowrap w-full py-1 px-2"
          onClick={signOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}

// function Spacer() {
//   return <hr className="my-2 border-t border-black" />;
// }
