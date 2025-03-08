'use client'

export default function SignInButton({ text, style }) {
  const submitHandler = (e) => {
    e.preventDefault();
    let [email, password] = e.target.form || [];
    email = email.value;
    password = password.value;
    console.log({ email, password });
  };
  return (
    <>
      <button onClick={submitHandler} className={style}>
        {text}
      </button>
    </>
  );
}
