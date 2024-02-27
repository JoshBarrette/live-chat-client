/**
 * Format of chat messages stored in state
 */
export interface ChatMessage {
  username: string;
  content: string;
  picture: string;
}

/**
 * Format of connected users sent from the API
 */
export interface ConnectedUser {
  username: string;
  picture: string;
}

/**
 * The user object attached to messages from the server
 */
export interface userType {
  firstName: string;
  lastName: string;
  picture: string;
}

/**
 * The payload sent to the server when sending a message
 */
export interface sendMessagePayload {
  message: string;
  user: userType;
}

/**
 * The payload received when the server emits a new message
 */
export interface NewMessageEvent {
  data: { username: string; content: string; picture: string };
}

/**
 * The payload received when the server updates the connected users
 */
export interface UpdateConnectedUsersEvent {
  data: { users: ConnectedUser[] };
}

/**
 * The payload received when the server sends the client the recently
 * sent messages
 */
export interface RecentMessageEvent {
  data: [{ username: string; content: string; picture: string }];
}

export interface ServerToClientEvents {
  message: (event: { data: string }) => void;
  new_message: (event: NewMessageEvent) => void;
  update_connected_users: (event: UpdateConnectedUsersEvent) => void;
  recent_messages: (event: RecentMessageEvent) => void;
}

export interface ClientToServerEvents {
  message: (m: string) => void;
  send_message: (data: { user: userType; content: string }) => void;
  user_disconnect: () => void;
}
