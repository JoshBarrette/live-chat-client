import { useState } from "react";
import { ChatSocket } from "../lib/ChatSocket";
import { ChatMessage, ConnectedUser } from "../lib/ChatSocket/types";

/**
 * Wrapper for chat socket and all of its state.
 * @returns The messages, connected users, a boolean for if there is an
 * error, the socket itself, and a function to clear all messages.
 */
export default function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [showError, setShowError] = useState<boolean>(false);
  const socket = ChatSocket.getInstance({
    messageSetter: (newMessages: ChatMessage[]) => {
      setMessages([...messages, ...newMessages]);
    },
    connectedUsersSetter: setConnectedUsers,
    errorSetter: setShowError,
  });

  return {
    messages,
    connectedUsers,
    showError,
    socket,
    clearMessages: () => setMessages([]),
  };
}
