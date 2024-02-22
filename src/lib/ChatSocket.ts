import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

export class ChatSocket {
  private static socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  private static messageSetter: (s: string) => void;
  private static connectedUsersSetter: (arr: string[]) => void;
  private static instance: ChatSocket | null = null;

  private constructor() {
    ChatSocket.socket = io(
      (import.meta.env.VITE_APP_SOCKET_URL + "/chat") as string,
      {
        auth: { token: Cookies.get("chat_token") },
      },
    );

    this.buildSocket();
  }

  static getInstance(
    messageSetter: (s: string) => void,
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

  handleNewMessage(event: any) {
    ChatSocket.messageSetter(event.data.username + ": " + event.data.message);
  }

  handleNewUsers(event: any) {
    ChatSocket.connectedUsersSetter(event.data.users);
  }

  sendMessage(data: sendMessagePayload) {
    ChatSocket.socket.emit("send_message", {
      user: data.user,
      message: data.message,
    });
  }
}

export interface userType {
  firstName: string;
  lastName: string;
  picture: string;
}

export interface sendMessagePayload {
  message: string;
  user: userType;
}

export interface ServerToClientEvents {
  message: (event: { data: string }) => void;
  new_message: (event: {
    data: { username: string; message: string; picture: string };
  }) => void;
  update_connected_users: (event: { data: { users: string[] } }) => void;
}

export interface ClientToServerEvents {
  message: (m: string) => void;
  send_message: (data: { user: userType; message: string }) => void;
  user_disconnect: () => void;
}
