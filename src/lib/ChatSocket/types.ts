export interface userType {
  firstName: string;
  lastName: string;
  picture: string;
}

export interface sendMessagePayload {
  message: string;
  user: userType;
}

export interface NewMessageEvent {
  data: { username: string; content: string; picture: string };
}

export interface UpdateConnectedUsersEvent {
  data: { users: string[] };
}

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
