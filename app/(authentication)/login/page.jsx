import LoginForm from "../../../components/authentication/LoginForm";
import { genSalt, hash } from "bcrypt";

export default async function Login() {
  const xsrf = await generateXSRF();
  return (
    <>
      <div className="w-full h-dvh dark:bg-gray-900 bg-white flex justify-center items-center">
        <LoginForm xsrfToken={xsrf} />
      </div>
    </>
  );
}

export async function generateXSRF() {
  const salt = await genSalt();
  const hashed = await hash("", salt);
  console.log("hash generated\n");
  return hashed;
}
