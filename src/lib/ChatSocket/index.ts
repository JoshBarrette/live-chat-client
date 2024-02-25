import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";
import { ChatMessage } from "../../Components/Chat";
import {
  ClientToServerEvents,
  NewMessageEvent,
  RecentMessageEvent,
  ServerToClientEvents,
  UpdateConnectedUsersEvent,
  sendMessagePayload,
} from "./types";

export class ChatSocket {
  private static socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  private static messageSetter: (newMessages: ChatMessage[]) => void;
  private static connectedUsersSetter: (arr: string[]) => void;
  private static errorSetter: (b: boolean) => void;
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

  static getInstance(props: {
    messageSetter: (newMessages: ChatMessage[]) => void;
    connectedUsersSetter: (arr: string[]) => void;
    errorSetter: (b: boolean) => void;
  }) {
    if (!ChatSocket.instance) {
      ChatSocket.instance = new ChatSocket();
    }
    ChatSocket.messageSetter = props.messageSetter;
    ChatSocket.connectedUsersSetter = props.connectedUsersSetter;
    ChatSocket.errorSetter = props.errorSetter;
    return ChatSocket.instance;
  }

  static userSignOut() {
    ChatSocket.socket.emit("user_disconnect");
  }

  buildSocket() {
    ChatSocket.socket.on("connect", () => {
      ChatSocket.errorSetter(false);
    });
    ChatSocket.socket.on("connect_error", () => {
      ChatSocket.errorSetter(true);
    });

    ChatSocket.socket.on("new_message", (event) =>
      this.handleNewMessage(event),
    );
    ChatSocket.socket.on("recent_messages", (event) => {
      this.handleRecentMessages(event);
    });
    ChatSocket.socket.on("update_connected_users", (event) =>
      this.handleNewUsers(event),
    );
  }

  handleNewMessage(event: NewMessageEvent) {
    ChatSocket.messageSetter([event.data]);
  }

  handleRecentMessages(event: RecentMessageEvent) {
    ChatSocket.messageSetter(event.data);
  }

  handleNewUsers(event: UpdateConnectedUsersEvent) {
    ChatSocket.connectedUsersSetter(event.data.users);
  }

  sendMessage(data: sendMessagePayload) {
    ChatSocket.socket.emit("send_message", {
      user: data.user,
      content: data.message,
    });
  }
}
