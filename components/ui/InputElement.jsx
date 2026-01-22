"use client";

import { useEffect, useState } from "react";

const embededDefaultStyle = `top-1/2 -translate-y-1/2 left-4 text-gray-400 text-md absolute italic`;
const embededFloatStyle = `-top-[0.9rem] bg-white left-2 px-1 text-black/70 text-sm absolute italic`;
const baseStyle = `select-none pointer-events-none font-customFont transition-all duration-150 ease-in-out`;

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
}) {
  const [content, setContent] = useState(value || "");
  const [labelStyleSelector, setLabelStyleSelector] = useState(
    content ? "FLOAT" : "DEFAULT"
  );
  useEffect(() => {
    if (value) {
      setContent(value);
      setLabelStyleSelector(value ? "FLOAT" : "DEFAULT");
    }
  }, [value]);

  const { containerStyle, inputStyle } = style || {};

  const floatStyle = customFloatStyle ?? embededFloatStyle;
  const defaultStyle = customDefaultStyle ?? embededDefaultStyle;

  const htmlInputFocusHandler = () => {
    if (labelStyleSelector === "DEFAULT") setLabelStyleSelector("FLOAT");
  };

  const htmlInputBlurHandler = () => {
    if (labelStyleSelector === "FLOAT" && !content)
      setLabelStyleSelector("DEFAULT");
  };

  const handleTypeing = (e) => {
    setContent(e.target.value);
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
          value={content}
          onChange={handleTypeing}
          onFocus={htmlInputFocusHandler}
          onBlur={htmlInputBlurHandler}
          autoComplete="off"
          disabled={disabled || false}
          className={
            inputStyle ||
            "rounded-md border border-gray-400 h-8 focus-visible:outline-none focus:ring-1 focus:border-blue-700 focus:ring-blue-700 p-2 dark:bg-slate-800"
          }
        ></input>
        {children}
      </div>
    </>
  );
}
