"use client";

import Link from "next/link";
import InputElement from "../ui/InputElement";
import SignInButton from "../ui/SingInButton";
import ErrorToast from "../ui/ErrorToast";
import { useState } from "react";

import { useAuth } from "../../hooks/auth";
import apiManager from "../../utils/ApiInterface";

export default function LoginForm() {
  const [signInError, setSignInError] = useState("");
  const { post } = apiManager;
  const { login } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    let [email, password] = e.target.form || [];
    email = email.value;
    password = password.value;
    /* if (!email || !password) {
      setSignInError("Please provide email and password");
      return;
    } */
    try {
      const response = await post(
        "/auth/sign-in",
        {
          /* email */email: 'test@email.com',
          /* password */password: 'anaAremere2!'
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      login(
        response.accessToken,
        response.email,
        "admin",
        response.firstName,
        response.lastName,
        response.phone,
        response.session
      );
      e.target.form.reset();
    } catch (err) {
      console.log(err);
      setSignInError(
        err?.message || "Unexpected error from the server",
      );
    }
  };

  return (
    <div className="flex flex-col h-dvh items-center justify-center gap-y-5 w-5/6 max-w-80 min-w-72">
      <ErrorToast
        text={signInError}
        style={`bg-red-200 w-full flex items-center justify-center p-4 text-red-900 rounded-md ${
          signInError ? "visible" : "invisible"
        }`}
      />
      <form
        className="bg-transparent rounded-md border-gray-200 border flex flex-col p-5 gap-y-7 items-center text-sm w-full"
        onChange={() => {
          if (signInError) return setSignInError("");
        }}
      >
        <InputElement label="Email" inputType="email" required={true} />
        <InputElement label="Password" inputType="password" required={true}>
          <Link
            href="/forgot-password"
            className="absolute -top-1 right-0 text-blue-600 text-xs"
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
          handler={submitHandler}
        />
      </form>
      <p className="p-8 w-full text-sm rounded-md border border-gray-300 flex justify-center">
        Don't have an account?&nbsp;
        <Link href="/register" className="text-blue-500">
          Create one
        </Link>
      </p>
    </div>
  );
}
