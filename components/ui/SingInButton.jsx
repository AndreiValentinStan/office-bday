
export default function SignInButton({ text, style, setError, handler }) {
  return (
    <>
      <button onClick={handler} className={style}>
        {text}
      </button>
    </>
  );
}
