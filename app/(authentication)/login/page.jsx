import LoginForm from "../../../components/authentication/LoginForm";
import { LoginGuard } from "../../../guards/LoginGuard";

export default async function Login() {
  return (
    <LoginGuard>
      <div className="w-full h-dvh dark:bg-gray-900 bg-white flex justify-center items-center">
        <LoginForm />
      </div>
    </LoginGuard>
  );
}
