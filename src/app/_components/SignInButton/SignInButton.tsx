"use client";
import { signIn, signOut } from "next-auth/react";

export const SignInButton = ({ signedIn }: { signedIn: boolean }) => {
  return signedIn
    ? (
      <button
        type="button"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={() => signOut({ callbackUrl: "/", redirect: true })}
      >
        Sign out
      </button>
    )
    : (
      <button
        type="button"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={
          // Change the callbackUrl to your desired redirect
          () => signIn(undefined, { callbackUrl: "/myMenu" })
        }
      >
        Sign in
      </button>
    );
};
