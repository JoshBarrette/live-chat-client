import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";
import {
  ChatMessage,
  ClientToServerEvents,
  ConnectedUser,
  NewMessageEvent,
  RecentMessageEvent,
  ServerToClientEvents,
  UpdateConnectedUsersEvent,
  sendMessagePayload,
} from "./types";

/**
 * Singleton class for connecting to the API socket
 */
export class ChatSocket {
  /**
   * The Socket that connects to the API
   */
  private static socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  /**
   * Sets the message state in the component
   */
  private static messageSetter: (newMessages: ChatMessage[]) => void;
  /**
   * Sets the connected users state in the component
   */
  private static connectedUsersSetter: (arr: ConnectedUser[]) => void;
  /**
   * Sets the error state in the component
   */
  private static errorSetter: (b: boolean) => void;
  /**
   * I may have goofed this, IDK why there is this AND socket :shrug:
   */
  private static instance: ChatSocket | null = null;

  /**
   * Creates and builds a new socket
   */
  private constructor() {
    ChatSocket.socket = io(
      (import.meta.env.VITE_APP_API_URL + "/chat") as string,
      {
        auth: { token: Cookies.get("chat_token") },
      },
    );

    this.buildSocket();
  }

  /**
   * Makes a new socket if needed, then sets the setters. The setters are reset every time
   * that react rerenders to keep up with the new state.
   * @param props The new setters
   * @returns An instance of our singleton
   */
  static getInstance(props: {
    messageSetter: (newMessages: ChatMessage[]) => void;
    connectedUsersSetter: (arr: ConnectedUser[]) => void;
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

  /**
   * Sings out the user
   */
  static userSignOut() {
    ChatSocket.socket.emit("user_disconnect");
  }

  /**
   * Attaches all of the listeners needed to the socket
   */
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

  /**
   * Handles when the server sends out a new message from a chatter
   * @param event Holds the new message in data
   */
  handleNewMessage(event: NewMessageEvent) {
    ChatSocket.messageSetter([event.data]);
  }

  /**
   * Handles when the server sends the client the recently sent messages on connect
   * @param event Holds all the recent messages in data
   */
  handleRecentMessages(event: RecentMessageEvent) {
    ChatSocket.messageSetter(event.data);
  }

  /**
   * Handles when the connected users changes
   * @param event The new list of connected users
   */
  handleNewUsers(event: UpdateConnectedUsersEvent) {
    ChatSocket.connectedUsersSetter(event.data.users);
  }

  /**
   * Sends a new message to the server
   * @param data The new message
   */
  sendMessage(data: sendMessagePayload) {
    ChatSocket.socket.emit("send_message", {
      user: data.user,
      content: data.message,
    });
  }
}
