import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";
import { ChatMessage } from "../../Components/Chat";
import {
  ClientToServerEvents,
  NewMessageEvent,
  ServerToClientEvents,
  UpdateConnectedUsersEvent,
  sendMessagePayload,
} from "./types";

export class ChatSocket {
  private static socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  private static messageSetter: (newMessage: ChatMessage) => void;
  private static connectedUsersSetter: (arr: string[]) => void;
  private static instance: ChatSocket | null = null;

  private constructor() {
    ChatSocket.socket = io(
      (import.meta.env.VITE_APP_API_URL + "/chat") as string,
      {
        auth: { token: Cookies.get("chat_token") },
      },
    );

    this.buildSocket();
  }

  static getInstance(
    messageSetter: (newMessage: ChatMessage) => void,
    connectedUsersSetter: (arr: string[]) => void,
  ) {
    if (!ChatSocket.instance) {
      ChatSocket.instance = new ChatSocket();
    }
    ChatSocket.messageSetter = messageSetter;
    ChatSocket.connectedUsersSetter = connectedUsersSetter;
    return ChatSocket.instance;
  }

  static userSignOut() {
    ChatSocket.socket.emit("user_disconnect");
  }

  buildSocket() {
    ChatSocket.socket.on("new_message", (event) =>
      this.handleNewMessage(event),
    );
    ChatSocket.socket.on("update_connected_users", (event) =>
      this.handleNewUsers(event),
    );
  }

  destroySocket() {
    ChatSocket.socket.off("new_message", (event) =>
      this.handleNewMessage(event),
    );
    ChatSocket.socket.off("update_connected_users", (event) =>
      this.handleNewUsers(event),
    );
  }

  handleNewMessage(event: NewMessageEvent) {
    ChatSocket.messageSetter({
      username: event.data.username,
      content: event.data.message,
      picture: event.data.picture,
    });
  }

  handleNewUsers(event: UpdateConnectedUsersEvent) {
    ChatSocket.connectedUsersSetter(event.data.users);
  }

  sendMessage(data: sendMessagePayload) {
    ChatSocket.socket.emit("send_message", {
      user: data.user,
      message: data.message,
    });
  }
}
