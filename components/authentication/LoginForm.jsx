import Link from "next/link";
import InputElement from "../ui/InputElement";
import SignInButton from "../ui/SingInButton";

export default function LoginForm() {
  return (
    <>
      <form className="absolute top-1/2 left-1/2 bg-slate-200/25 rounded-md border-gray-200 border flex flex-col p-5 -translate-x-1/2 -translate-y-1/2 gap-y-7 items-center text-sm w-5/6 max-w-80 min-w-72">
        <InputElement label='Email' inputType='email' required={true}/>
        <InputElement label='Password' inputType='password' required={true}>
            <Link href='/forgot-password' className="absolute top-[2px] right-0 text-blue-600 text-xs">Forgot password?</Link>
        </InputElement>
        <SignInButton style={"w-full bg-green-600 hover:bg-green-600/90 m-3 p-2 rounded-md text-white"} text='Sign In'/>
      </form>
    </>
  );
}
