import { useState } from "react";
import { ChatSocket } from "../lib/ChatSocket";
import { ChatMessage, ConnectedUser } from "../lib/ChatSocket/types";
import { useAppSelector } from "../store/hooks";

/**
 * Wrapper for chat socket and all of its state.
 * @returns The messages, connected users, a boolean for if there is an
 * error, the socket itself, and a function to clear all messages.
 */
export default function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [showError, setShowError] = useState<boolean>(false);

  const isLoaded = useAppSelector((state) => state.user.isLoaded);
  let socket;
  if (isLoaded) {
    socket = ChatSocket.getInstance({
      messageSetter: (newMessages: ChatMessage[]) => {
        setMessages([...messages, ...newMessages]);
      },
      connectedUsersSetter: setConnectedUsers,
      errorSetter: setShowError,
    });
  }

  return {
    messages,
    connectedUsers,
    showError,
    socket: socket ?? null,
    clearMessages: () => setMessages([]),
  };
}
