"use client";
import { useRouter } from "next/router";
import Axios from "../../utils/axios";

export default function SignInButton({ text, style, setError }) {
  const axiosInstance = Axios.getAxiosInstance({
    baseURL: "http://localhost:3000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    let [email, password] = e.target.form || [];
    email = email.value;
    password = password.value;
    if (!email || !password) {
      setError("Please provide email and password");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "auth/sign-in",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        //set-up access token
        Axios.setAccessToken(response.data.accessToken);
      }
      e.target.form.reset();
      
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <button onClick={submitHandler} className={style}>
        {text}
      </button>
    </>
  );
}
