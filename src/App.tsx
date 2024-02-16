import "./App.css";
import { useSocket } from "./Socket";
import SignIn from "./Components/SignIn";
import Chat from "./Components/Chat";
import CookieHandler from "./Components/CookieHandler";

export default function App() {
  const { username } = useSocket();
  
  return (
    <div>
      <CookieHandler />
      {username ? <Chat /> : <SignIn />}
    </div>
  );
}
