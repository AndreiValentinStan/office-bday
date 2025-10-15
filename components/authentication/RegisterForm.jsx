"use client";

import Link from "next/link";
import InputElement from "../ui/InputElement";
import SignInButton from "../ui/SingInButton";
import { useState } from "react";
import Axios from "../../utils/axios";
import { useRouter } from "next/navigation";
import ErrorToast from "../ui/ErrorToast";
import { Spinner } from "flowbite-react";

const formInputElements = [
  {
    label: "First Name",
    name: "firstName",
    required: true,
  },
  {
    label: "Last Name",
    name: "lastName",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    required: true,
  },
  {
    label: "Phone Number",
    name: "phone",
    required: false,
  },
  {
    label: "Password",
    name: "password",
    required: true,
    type: "password",
  },
  {
    label: "Repeat Password",
    name: "rePassword",
    required: true,
    type: "password",
  },
];

const fieldStyle = {
  containerStyle:
    "flex flex-col flex-[1_0_21%] text-gray-800 gap-y-2 relative dark:text-gray-100",
  inputStyle:
    "rounded-md border border-gray-400 focus-visible:outline-none focus:ring-1 focus:border-blue-700 focus:ring-blue-700 px-2 dark:bg-slate-800 py-2 text-gray-800",
};

export default function RegisterForm() {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const registerHandler = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {};
    for (const value of form.entries()) {
      body[value[0]] = value[1];
    }
    if (body.password !== body.rePassword) {
      setError("Passwords doesn`t match");
      return;
    }
    try {
      setIsLoading(true);
      const axiosInstance = Axios.getAxiosInstance();
      const response = await axiosInstance.post("auth/register", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response?.status === 201) {
        router.replace(`/register-confirmation/${response.data.data.userId}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(error?.response?.data?.error || "Unexpected error");
        return;
      }
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="h-dvh w-full bg-white-100 flex flex-col items-center justify-center gap-y-4">
        <ErrorToast
          text={error}
          style={`bg-red-200 flex items-center justify-center p-4 text-red-900 rounded-md ${
            error ? "visible" : "hidden"
          }`}
        />
        {/* register form */}
        <form
          onChange={() => {
            if (error) setError("");
          }}
          onSubmit={registerHandler}
          className="flex max-w-[600px] flex-wrap justify-center items-center p-10 border border-black/20 rounded-md gap-x-5 gap-y-5 relative"
        >
          {isLoading && (
            <div className="absolute w-full h-full bg-white/50 z-10 flex justify-center items-center">
              <Spinner size="lg" className="fill-blue-600"></Spinner>
            </div>
          )}
          {formInputElements.map((element, index) => (
            <InputElement
              label={element?.label || ""}
              required={element.required}
              inputType={element.type}
              style={fieldStyle}
              key={index}
              name={element.name}
              floatEffect={true}
            />
          ))}
          <SignInButton
            text={"Register"}
            style={
              "w-1/2 max-w-[200px] bg-green-600 hover:bg-green-600/90 m-3 p-2 rounded-md text-white"
            }
          />
          {/* toggle to login form */}
          <span className=" text-gray-700 text-sm w-full flex justify-center">
            Already have an account?&nbsp;
            <Link href="/login" className="text-blue-500">
              Sign In
            </Link>
          </span>
        </form>
      </div>
    </>
  );
}
