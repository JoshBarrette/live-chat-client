import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearUser } from "../store/userSlice";

export default function useUser() {
  const selector = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return {
    isLoaded: selector.isLoaded,
    user: selector.user,
    isSignedIn: selector.isSignedIn,
    signOut: () => {
      dispatch(clearUser());
      Cookies.remove("chat_token");
    },
  };
}
