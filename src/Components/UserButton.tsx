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
        className={`flex max-h-12 rounded-full ring-indigo-600 transition-all ${showOpts ? "ring ring-offset-1" : "ring-0 ring-offset-0"}`}
      >
        <img
          src={user?.picture}
          alt="profile picture"
          className="rounded-full bg-indigo-600 text-sm"
          onClick={toggleShowOpts}
          width="48"
          height="48"
        />
      </button>
      <div
        className={`absolute -top-2 right-2 z-40 w-48 -translate-y-full rounded-lg border border-neutral-400 bg-white p-1.5 ${showOpts ? "scale-100" : "scale-0"}`}
      >
        <Button
          className="w-full whitespace-nowrap px-2 py-1"
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
