import { useEffect, useState } from "react";
export default function FilterField({
  label,
  inputType,
  fieldValue,
  setFieldValue,
  searchParam,
}) {
  const defaultStyle = {
    name: "defaultStyle",
    value: "top-1/2 -translate-y-1/2 text-sm px-0 text-gray-400 left-2",
  };
  const typedStyle = {
    name: "typedStyle",
    value: "-top-2 text-xs px-1 rounded-md py-0 text-blue-500 left-1",
  };
  const [selectedStyle, setSelectedStyle] = useState(defaultStyle);
  useEffect(() => {
    if (!fieldValue) setSelectedStyle(defaultStyle);
    else setSelectedStyle(typedStyle);
  }, [fieldValue]);
  return (
    <div className="flex gap-x-1 items-center relative">
      <label
        className={`absolute bg-white transition-all duration-150 pointer-events-none ${selectedStyle.value}`}
      >
        {label}
      </label>
      <input
        type={inputType}
        className="py-1 pl-2 rounded-sm border border-blue-400 focus:outline-blue-500 focus:outline focus:border-transparent focus:outline-2 text-gray-600"
        onChange={(e) => {
          setFieldValue(e, searchParam);
        }}
        onFocus={() => {
          selectedStyle.name === "defaultStyle" || fieldValue
            ? setSelectedStyle(typedStyle)
            : null;
        }}
        onBlur={() => {
          selectedStyle.name === "typedStyle" && !fieldValue
            ? setSelectedStyle(defaultStyle)
            : "";
        }}
        value={fieldValue || ""}
      ></input>
    </div>
  );
}
