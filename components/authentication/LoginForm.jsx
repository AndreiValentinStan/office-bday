"use client";

import Link from "next/link";
import InputElement from "../ui/InputElement";
import SignInButton from "../ui/SingInButton";
import ErrorToast from "../ui/ErrorToast";
import { useState } from "react";

export default function LoginForm() {
  const [signInError, setSignInError] = useState("");
  return (
    <div className="flex flex-col h-dvh items-center justify-center gap-y-5 w-5/6 max-w-80 min-w-72">
      <ErrorToast
        text={signInError}
        style={`bg-red-200 w-full flex items-center justify-center p-4 text-red-900 rounded-md ${
          signInError ? "visible" : "invisible"
        }`}
      />
      <form
        className="bg-slate-200/25 rounded-md border-gray-200 border flex flex-col p-5 gap-y-7 items-center text-sm w-full"
        onChange={() => {
          if (signInError) return setSignInError("");
        }}
      >
        <InputElement label="Email" inputType="email" required={true} />
        <InputElement label="Password" inputType="password" required={true}>
          <Link
            href="/forgot-password"
            className="absolute top-[2px] right-0 text-blue-600 text-xs"
          >
            Forgot password?
          </Link>
        </InputElement>
        <SignInButton
          style={
            "w-full bg-green-600 hover:bg-green-600/90 m-3 p-2 rounded-md text-white"
          }
          text="Sign In"
          setError={setSignInError}
        />
      </form>
      <span className="p-8 w-full text-sm rounded-md border border-gray-300 flex justify-center">
        Don't have an account?
        <Link href="/register" className="text-blue-500">
          Create one
        </Link>
      </span>
    </div>
  );
}