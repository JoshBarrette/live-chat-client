import { useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";

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
    <div className="relative rounded-full" ref={contentRef}>
      <img
        src={user?.picture}
        alt="profile picture"
        className="my-auto rounded-full bg-slate-600 cursor-pointer"
        onClick={toggleShowOpts}
        width="48"
        height="48"
      />
      <div
        className={`absolute bg-red-500 right-2 -top-2 rounded z-40 -translate-y-full ${showOpts ? "scale-100" : "scale-0"}`}
      >
        <button className="whitespace-nowrap" onClick={signOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
