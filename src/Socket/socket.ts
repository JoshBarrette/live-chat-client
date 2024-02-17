import Cookies from "js-cookie";
import { Dispatch } from "react";
import { Socket, io } from "socket.io-client";

export interface ServerToClientEvents {
  message: (event: { data: string }) => void;
  new_message: (event: { data: { username: string; message: string } }) => void;
}

export interface ClientToServerEvents {
  message: (m: string) => void;
  send_message: (data: { username: string; message: string }) => void;
}

export function createSocketAndContext(
  messages: string[],
  setMessages: Dispatch<string[]>,
  connectedUsers: string[],
  setConnectedUsers: Dispatch<string[]>,
  username: string | undefined,
  setUsername: Dispatch<string | undefined>,
) {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    process.env.REACT_APP_SOCKET_URL as string,
    { auth: { token: Cookies.get("chat_token") } },
  );

  socket.on("new_message", (event) => {
    setMessages([event.data.username + ": " + event.data.message, ...messages]);
  });

  return {
    socket,
    messages,
    setMessages,
    connectedUsers,
    setConnectedUsers,
    username,
    setUsername,
  };
}
