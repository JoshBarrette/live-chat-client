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
  data: { username: string; message: string; picture: string };
}

export interface UpdateConnectedUsersEvent {
  data: { users: string[] };
}

export interface ServerToClientEvents {
  message: (event: { data: string }) => void;
  new_message: (event: NewMessageEvent) => void;
  update_connected_users: (event: UpdateConnectedUsersEvent) => void;
}

export interface ClientToServerEvents {
  message: (m: string) => void;
  send_message: (data: { user: userType; message: string }) => void;
  user_disconnect: () => void;
}
