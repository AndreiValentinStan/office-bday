export default function InputElement({label, inputType, children, required}) {
  return (
    <>
      <div className="flex flex-col w-full text-gray-800 gap-y-2 relative">
        <label className="select-none text-xl/2 font-customFont">{label}</label>
        <input
          type={inputType}
          required={required}
          className="rounded-md border border-gray-400 h-8 focus-visible:outline-none focus:ring-1 focus:border-blue-700 focus:ring-blue-700 p-2"
        ></input>
        {children}
      </div>
    </>
  );
}
