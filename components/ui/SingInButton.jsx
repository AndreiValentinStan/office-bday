"use client";

export default function SignInButton({ text, style, setError }) {
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
      const response = await fetch("http://127.0.0.1:3000/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: 'test@email.com',
          password: '1234',
        }),
      });
      if (!response || !response.ok) {
        setError("Couldn`t process your request!");
        return;
      }
      const data = await response.json();
      if (data?.message) console.log(data.message);
    } catch (err) {
      console.log("Error on signing in ");
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
