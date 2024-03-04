import Cookie from "js-cookie";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearUser, newUser, setIsLoaded } from "../store/slices/userSlice";
import { useQuery } from "@tanstack/react-query";
import { ChatSocket } from "../lib/ChatSocket";

/**
 * Form of the response from the backend when verifying the user
 */
interface QueryRes {
  valid: boolean;
  firstName: string;
  lastName: string;
  picture: string;
}

/**
 * Used for keeping track of currently signed in user state
 * @returns Status of the user being loaded/logged in, the user object, and
 * a sign out function. Waits for the user to load before connecting to the backend.
 */
export default function useUser() {
  const oldToken = Cookie.get("chat_token");
  const selector = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const { isFetched } = useQuery({
    queryKey: ["useUser"],
    queryFn: async () => {
      const r: QueryRes = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/auth/jwt/verify/${oldToken}`,
        {
          headers: {
            Authorization: oldToken!,
          },
        },
      )
        .then(async (res) => await res.json())
        .catch((e) => console.log(e));

      if (r.valid) {
        dispatch(
          newUser({
            firstName: r.firstName,
            lastName: r.lastName,
            picture: r.picture,
            token: oldToken!,
          }),
          setIsLoaded(true),
        );
      } else {
        dispatch(setIsLoaded(true));
      }

      return r;
    },
    enabled: oldToken !== undefined && !selector.isLoaded,
  });

  return {
    isLoaded: isFetched || oldToken === undefined || selector.isLoaded,
    user: selector.user,
    isSignedIn: selector.isSignedIn,
    signOut: () => {
      ChatSocket.userSignOut();
      dispatch(clearUser());
      Cookie.remove("chat_token");
    },
  };
}
