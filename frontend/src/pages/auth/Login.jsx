import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <SignIn signUpUrl="/signup" />
    </div>
  );
}