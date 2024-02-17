import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

export class ChatSocket {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  private static setter: (s: string) => void;
  private static instance: ChatSocket | null = null;

  private constructor() {
    this.socket = io(process.env.REACT_APP_SOCKET_URL as string, {
      auth: { token: Cookies.get("chat_token") },
    });

    this.buildSocket();
  }

  static getInstance(setter: (s: string) => void) {
    if (!ChatSocket.instance) {
      ChatSocket.instance = new ChatSocket();
    }
    ChatSocket.setter = setter;
    return ChatSocket.instance;
  }

  buildSocket() {
    this.socket.on("new_message", (event) => this.handleNewMessage(event));
  }

  destroySocket() {
    this.socket.off("new_message", (event) => this.handleNewMessage(event));
  }

  handleNewMessage(event: any) {
    ChatSocket.setter(event.data.username + ": " + event.data.message);
  }

  sendMessage(data: sendMessagePayload) {
    console.log("send");
    this.socket.emit("send_message", {
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
}

export interface ClientToServerEvents {
  message: (m: string) => void;
  send_message: (data: { user: userType; message: string }) => void;
}
