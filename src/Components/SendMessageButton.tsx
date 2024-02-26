import useUser from "../hooks/useUser";
import { Button } from "./Button";

export default function SendMessageButton() {
  const { isSignedIn } = useUser();

  return (
    <>
      {isSignedIn ? (
        <Button className="h-12 max-w-full flex-grow" type="submit">
          Send Message
        </Button>
      ) : (
        <Button className="h-12 flex-grow p-0">
          <a href={`${import.meta.env.VITE_APP_API_URL}/api/auth/google/login`}>
            <p className="h-full max-w-full rounded-b py-2">Sign In to Chat!</p>
          </a>
        </Button>
      )}
    </>
  );
}
