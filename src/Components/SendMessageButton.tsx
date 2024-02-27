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
        <Button className="h-12 w-full flex-grow p-0" type="submit">
          <div className="h-full w-full">
            <a
              href={`${import.meta.env.VITE_APP_API_URL}/api/auth/google/login`}
              className="flex h-full items-center justify-center"
            >
              Sign In to Chat!
            </a>
          </div>
        </Button>
      )}
    </>
  );
}
