import { useEffect, useRef } from "react";

function useOutsideClick(ref, stateHandler) {
  useEffect(() => {
    function mouseDownHandler(e) {
      if (ref?.current && ref?.current.contains(e.target)) {
        console.log("inside");
        return stateHandler(false);
      }
      console.log("outside");
      return stateHandler(true);
    }
    document.addEventListener("mousedown", mouseDownHandler);
    return () => {
      document.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [ref]);
}

export default function OutsideWrapper({ children, stateHanlder }) {
  const ref = useRef(null);
  useOutsideClick(ref, stateHanlder);
  return <div ref={ref}>{children}</div>;
}
