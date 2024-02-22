import { useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";

export default function UserButton() {
  const optsRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { user, isSignedIn, signOut } = useUser();
  const [showOpts, setShowOpts] = useState(false);

  function toggleShowOpts() {
    setShowOpts(!showOpts);
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      optsRef.current &&
      imgRef.current &&
      !optsRef.current.contains(event.target as Node) &&
      !imgRef.current.contains(event.target as Node)
    ) {
      setShowOpts(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [optsRef]);

  if (!isSignedIn) return null;

  return (
    <div className="relative rounded-full">
      <img
        src={user?.picture}
        alt="pfp"
        className="my-auto size-12 rounded-full bg-slate-600 cursor-pointer"
        ref={imgRef}
        onClick={toggleShowOpts}
      />
      <div
        ref={optsRef}
        className={`absolute bg-red-500 right-2 -top-2 rounded z-40 -translate-y-full ${showOpts ? "scale-100" : "scale-0"}`}
      >
        <button className="whitespace-nowrap" onClick={signOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
