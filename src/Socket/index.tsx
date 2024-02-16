import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  createSocketAndContext,
} from "./socket";

interface SocketContextState {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  messages: string[];
  setMessages: Dispatch<string[]>;
  connectedUsers: string[];
  setConnectedUsers: Dispatch<string[]>;
  username: string | undefined;
  setUsername: Dispatch<string | undefined>;
}

const SocketContext = createContext<SocketContextState | undefined>(undefined);

export function SocketProvider(props: { children?: ReactNode }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [username, setUsername] = useState<string | undefined>(undefined);

  return (
    <SocketContext.Provider
      value={createSocketAndContext(
        messages,
        setMessages,
        connectedUsers,
        setConnectedUsers,
        username,
        setUsername,
      )}
    >
      {props.children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "Socket context not initialized or useSocket used outside of SocketProvider",
    );
  }
  return context;
}
