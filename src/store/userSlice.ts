import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface userObj {
  firstName: string;
  lastName: string;
  picture: string;
  token: string;
}

export interface userState {
  user: userObj | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

const initialState: userState = {
  user: null,
  isLoaded: false,
  isSignedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isSignedIn = false;
      state.isLoaded = true;
    },
    newUser: (state, action: PayloadAction<userObj>) => {
      state.user = action.payload;
      state.isLoaded = true;
      state.isSignedIn = true;
    },
    newToken: (state, action: PayloadAction<string>) => {
      if (!state.user) return;

      state.user.token = action.payload;
    },
    setIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    setIsSignedIn: (state, action: PayloadAction<boolean>) => {
      state.isSignedIn = action.payload;
    },
  },
});

export const { clearUser, newUser, newToken, setIsLoaded, setIsSignedIn } =
  userSlice.actions;

export default userSlice.reducer;
