import useUser from "../hooks/useUser";
import { Button } from "./Button";

export default function SendMessageButton() {
  const { isSignedIn } = useUser();

  return (
    <>
      {isSignedIn ? (
        <Button className="max-w-full flex-grow" type="submit">
          Send Message
        </Button>
      ) : (
        <Button className="p-0 flex-grow">
          <a href={`${import.meta.env.VITE_APP_API_URL}/api/auth/google/login`}>
            <p className="max-w-full h-full py-2 rounded">Sign In to Chat!</p>
          </a>
        </Button>
      )}
    </>
  );
}
