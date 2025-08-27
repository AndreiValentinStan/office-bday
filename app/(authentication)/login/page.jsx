import LoginForm from "../../../components/authentication/LoginForm";


export default async function Login() {
  return (
    <>
      <div className="w-full h-dvh dark:bg-gray-900 bg-white flex justify-center items-center">
        <LoginForm/>
      </div>
    </>
  );
}