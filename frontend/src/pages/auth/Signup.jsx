import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <SignUp signInUrl="/login" />
    </div>
  );
}