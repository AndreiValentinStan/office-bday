"use client";

import { useState } from "react";

const embededDefaultStyle = `translate-y-0 left-4 text-gray-400 text-md absolute italic`;
const embededFloatStyle = `-translate-y-[1.25rem] bg-white left-2 text-black/70 text-sm absolute italic`;
const baseStyle = `select-none pointer-events-none font-customFont transition-[transform, background-color] ease-in-out duration-100 top-[1.1rem] px-[2px] rounded-md h-1 flex items-center`;

export default function InputElement({
  label,
  inputType,
  children,
  required,
  style,
  name,
  floatEffect = false,
  customFloatStyle = null,
  customDefaultStyle = null,
  value,
  disabled,
  parrentContentSetter
}) {
console.log({value});
  const [focusStatus, setFocusStatus] = useState(!!value);
  let labelStyleSelector = value || focusStatus ? "FLOAT" : "DEFAULT";

  const { containerStyle, inputStyle } = style || {};

  const floatStyle = customFloatStyle ?? embededFloatStyle;
  const defaultStyle = customDefaultStyle ?? embededDefaultStyle;

  const htmlInputFocusHandler = () => {
    setFocusStatus(true);
  };

  const htmlInputBlurHandler = () => {
    if (!value) {
      setFocusStatus(false);
    }
  };

  const handleTypeing = (e) => {
    if (parrentContentSetter) parrentContentSetter(e);
  };

  return (
    <>
      <div
        className={
          containerStyle ||
          "flex flex-col w-full text-gray-800 gap-y-2 relative dark:text-gray-100"
        }
      >
        <label
          className={`${baseStyle} ${
            floatEffect
              ? labelStyleSelector === "DEFAULT"
                ? defaultStyle
                : floatStyle
              : ""
          }`}
        >
          {label}
        </label>
        <input
          type={inputType}
          name={name}
          required={required}
          {...(value !== undefined ? {value, onChange: handleTypeing} : {})}
          //onChange={handleTypeing}
          onFocus={htmlInputFocusHandler}
          onBlur={htmlInputBlurHandler}
          autoComplete="off"
          disabled={!!disabled}
          className={
            inputStyle ||
            `[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-md border border-gray-400 h-8 focus-visible:outline-none focus:ring-1 focus:border-blue-700 p-2 dark:bg-slate-800 disabled:text-red-900 ${inputType === 'number' ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''}`
          }
        ></input>
        {children}
      </div>
    </>
  );
}
