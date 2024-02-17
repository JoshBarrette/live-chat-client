import "./App.css";
import { useSocket } from "./Socket";
import SignIn from "./Components/SignIn";
import Chat from "./Components/Chat";

export default function App() {
  const { username } = useSocket();
  
  return (
    <div>
      {username ? <Chat /> : <SignIn />}
    </div>
  );
}
