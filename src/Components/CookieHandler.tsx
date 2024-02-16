import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Cookie from "js-cookie";
import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { newUser, setIsLoaded } from "../store/userSlice";

interface QueryRes {
  valid: boolean;
  firstName: string;
  lastName: string;
  picture: string;
}

export default function CookieHandler() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const newToken = queryParams.get("token");
  const oldToken = Cookie.get("chat_token");
  const queryToken = newToken ?? oldToken ?? undefined;

  useQuery({
    queryKey: ["verifyToken", queryToken],
    queryFn: async ({ queryKey }) => {
      if (queryKey[1] === undefined) {
        dispatch(setIsLoaded(false));
        return { valid: false };
      }

      const r: QueryRes = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/jwt/verify/${queryKey[1]}`,
      ).then(async (res) => await res.json());

      if (r.valid) {
        Cookie.set("chat_token", queryKey[1], { expires: 1 / 24, path: "/" });
        dispatch(
          newUser({
            firstName: r.firstName,
            lastName: r.lastName,
            picture: r.picture,
            token: queryToken!,
          }),
        );
      } else {
        Cookie.remove("chat_token");
        dispatch(setIsLoaded(false));
      }

      return r;
    },
  });

  useEffect(() => {
    if (newToken) {
      navigate(location.pathname, { replace: true });
    }
  });

  return null;
}
