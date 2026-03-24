"use client";

import Link from "next/link";
import InputElement from "../ui/InputElement";
import SignInButton from "../ui/SingInButton";
import { useState, useRef, useEffect } from "react";
import ErrorToast from "../ui/ErrorToast";
import { Spinner } from "flowbite-react";
import { emailSchema } from "../../validators/register";
import toast from "react-hot-toast";
import ApiManager from "../../utils/ApiInterface";
import { useRouter } from "next/navigation";

const formInputElements = [
  {
    label: "First Name",
    name: "firstName",
    required: true,
  },
  {
    label: "Last Name",
    name: "lastName",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    required: true,
  },
  {
    label: "Phone Number",
    name: "phone",
    required: false,
  },
  {
    label: "Password",
    name: "password",
    required: true,
    type: "password",
  },
  {
    label: "Repeat Password",
    name: "passwordConfirm",
    required: true,
    type: "password",
  },
];

const fieldStyle = {
  containerStyle:
    "flex flex-col flex-[1_0_21%] text-gray-800 gap-y-2 relative dark:text-gray-100",
  inputStyle:
    "rounded-md border border-gray-400 focus-visible:outline-none focus:ring-1 focus:border-blue-700 focus:ring-blue-700 px-2 dark:bg-slate-800 py-2 text-gray-800",
};

const emailSentSuccesfullyMessage =
  "An email with an OTP code was send to email address introduced in this form. In order to be able to register, please insert recieved code in boxes below";

const defaultUser = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirm: "",
  phone: "",
};

const waitUntilOtpIsGeneratedInMiliseconds = 2000;
const waitBeforeResendOtpInSeconds = 5;

const { post, get } = ApiManager;

async function sendOtpEmail(
  email,
  requestCompletionSetter,
  requestStatusSetter,
) {
  const abortController = new AbortController();
  const requestOptions = {
    signal: abortController.signal,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  };
  const request = new Request("/api/auth/generateOTP.js", requestOptions);

  try {
    const result = await fetch(request);
    if (result) {
      const data = await result.json();
      requestStatusSetter(true);
    }
  } catch (e) {
    console.log(e);
    /* requestStatusSetter(false); */ requestStatusSetter(true);
  } finally {
    requestCompletionSetter(true);
  }
  return abortController;
}

async function verifyOtpCode(code, email, loadingController) {
  loadingController(true);
  try {
    const resp = await post("/auth/verify-otp", {
      code,
      email,
    });
    console.log(resp);
  } catch (e) {
    console.log(e);
  }
  loadingController(false);
}

export default function RegisterForm() {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailableResendOTP, setIsAvailableResendOTP] = useState(false);
  const [secondsBeforeResendOTP, setSecondsBeforeResendOTP] = useState(
    waitBeforeResendOtpInSeconds,
  );
  const [abortController, setAbortController] = useState(null);

  const [otpBoxes, setOtpBoxes] = useState(new Array());
  const [requestSended, setRequestSended] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const otpInputRefs = useRef(null);
  const [isOtpVisible, setIsOtpVisible] = useState(false);

  const [accountData, setAccountData] = useState(defaultUser);

  const [isOtpSectionActive, setIsOptSectionActive] = useState(false);

  const router = useRouter();

  const registerHandler = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {};
    for (const value of form.entries()) {
      body[value[0]] = value[1];
    }
    if (body.password !== body.passwordConfirm) {
      setError("Passwords doesn`t match");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/register", {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success, error, data } = await response.json();
      if (!success) throw Error(error);

      router.replace(`/register-confirmation/${data?.userId}`);
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(error?.response?.data?.error || "Unexpected error");
        return;
      }
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const otpHandler = (val, actionType = "add") => {
    let length = otpBoxes.length;
    switch (actionType) {
      case "add":
        if (otpBoxes.length >= 6) {
          console.log("gata, sunt plin");
          return;
        }
        setOtpBoxes((p) => [...p, val]);
        length++;
        break;
      case "del":
        if (otpBoxes.length <= 0) {
          console.log("sunt prea mic, nu ma poti sterge");
          return;
        }
        setOtpBoxes((p) => p.toSpliced(-1, 1));
        length--;
        break;
      default:
        return;
    }
  };

  // verify otp state
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);

  // verify otp when full code is provided
  useEffect(() => {
    if (otpBoxes.length === 6) {
      // disable otp section
      setIsOptSectionActive(false);

      // set loading indicator
      verifyOtpCode(otpBoxes.join(""), accountData.email, setIsLoadingVerify);

      // clear loding indicator based on request status
    }
  }, [otpBoxes]);

  function abortCurrentRequest() {
    if (abortController) abortController.abort();
    setAbortController(null);
    _setSecondsBeforeResendOTP(waitBeforeResendOtpInSeconds);
  }

  function clearOtpData() {
    abortCurrentRequest();
    setIsOptSectionActive(false);
    setIsOtpVisible(false);
    setOtpBoxes(Array());
    setRequestSended(false);
    setRequestStatus(false);
    setIsAvailableResendOTP(false);
  }

  const timeoutIdRef = useRef(null);
  const [isEmailEditted, setIsEmailEditted] = useState(false);

  // check if otp is visible
  useEffect(() => {
    setIsEmailEditted(true);
    async function handleOtpSectionDisplay() {
      if (
        accountData.email &&
        emailSchema.safeParse(accountData.email)?.success
      ) {
        if (timeoutIdRef.current) {
          //console.log("clearing timout");
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = null;
        }
        setIsEmailEditted((prev) => true);
        timeoutIdRef.current = setTimeout(async () => {
          setIsOtpVisible((prev) => true);
          const abortController = await sendOtpEmail(
            accountData.email,
            setRequestSended,
            setRequestStatus,
          );
          setAbortController((prev) => abortController);
          setIsEmailEditted((prev) => false);
          _setSecondsBeforeResendOTP(waitBeforeResendOtpInSeconds);
          toast.success("OTP code sent successfully to " + accountData.email);
        }, 2000);
      } else {
        if (timeoutIdRef.current) {
          //console.log("clearing timeout on close");
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = null;
        }

        clearOtpData();
      }
    }
    handleOtpSectionDisplay();
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [accountData?.email]);

  function handleAccountDataChange({ target }) {
    if (!target) return;
    let { value, name } = target;
    switch (name) {
      case "rePassword":
        name = "passwordConfirm";
        break;
      default:
        break;
    }
    if (!name) return;

    setAccountData((prevAccountData) => ({
      ...prevAccountData,
      [name]: value,
    }));
  }

  // cleanup effect
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  const secondsBeforeResendOtpRef = useRef(waitBeforeResendOtpInSeconds);

  function _setSecondsBeforeResendOTP(amount) {
    secondsBeforeResendOtpRef.current = amount;
    setSecondsBeforeResendOTP(() => amount);
  }

  // timer effect
  useEffect(() => {
    let intervalId = null;
    if (requestStatus) {
      intervalId = setInterval(() => {
        if (secondsBeforeResendOtpRef.current > 1)
          return _setSecondsBeforeResendOTP(
            secondsBeforeResendOtpRef.current - 1,
          );

        _setSecondsBeforeResendOTP(waitBeforeResendOtpInSeconds);
        setIsAvailableResendOTP(true);
        setRequestStatus(false);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [requestStatus]);

  return (
    <>
      <div className="h-dvh w-full bg-white-100 flex flex-col items-center justify-center gap-y-4">
        <ErrorToast
          text={error}
          style={`bg-red-200 flex items-center justify-center p-4 text-red-900 rounded-md ${
            error ? "visible" : "hidden"
          }`}
        />
        {/* register form */}
        <form
          onSubmit={registerHandler}
          className={`flex max-w-[600px] flex-wrap justify-center items-center p-10 border border-black/20 rounded-md gap-x-4 gap-y-10 relative transition-all`}
        >
          {isLoading && (
            <div className="absolute w-full h-full bg-white/50 z-10 flex justify-center items-center">
              <Spinner size="lg" className="fill-blue-600"></Spinner>
            </div>
          )}
          {formInputElements.map((element, index) => (
            <InputElement
              label={element?.label || ""}
              required={element.required}
              inputType={element.type}
              style={fieldStyle}
              key={index}
              name={element.name}
              floatEffect={true}
              parrentContentSetter={handleAccountDataChange}
            />
          ))}
          <div
            aria-disabled={!isOtpVisible}
            className={`group relative border w-full flex gap-y-4 flex-col items-center overflow-hidden transition-all duration-200 delay-200 bg-slate-100/80 opacity-0 rounded-md aria-disabled:cursor-not-allowed p-2 h-fit ${isOtpVisible ? "opacity-100" : "opacity-30 "}`}
            onKeyDown={({ key }) => {
              switch (true) {
                case "0123456789".includes(key):
                  otpHandler(key, "add");
                  return;
                case key === "Backspace":
                  otpHandler(null, "del");
                  return;
                default:
                  console.log("default branch", key);
                  return;
              }
            }}
            onFocus={(e) => {
              e.preventDefault();
              setIsOptSectionActive(true);
            }}
            onBlur={(e) => {
              e.preventDefault();
              setIsOptSectionActive(false);
            }}
          >
            {/* loading verify otp code spinner */}
            {isLoadingVerify && (
              <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center flex-col bg-slate-100/95">
                <Spinner size="lg" className="fill-blue-500"></Spinner>
                <span className="text-gray-700 italic font-thin">
                  Verifying code ...
                </span>
              </div>
            )}
            <span className="text-center text-xs">
              {emailSentSuccesfullyMessage}
            </span>

            <div className="w-full flex justify-center gap-x-1 py-1">
              {Array(6)
                .fill(null)
                .map((_, index) => {
                  const isActive =
                    (otpBoxes.length === index ||
                      (otpBoxes.length > 5 && index === 5)) &&
                    isOtpSectionActive;
                  return (
                    <input
                      ref={otpBoxes.length === index ? otpInputRefs : null}
                      size={1}
                      autoComplete="off"
                      key={index}
                      disabled={!requestSended}
                      // autoFocus={index === 0 && otpBoxes.length === 0}
                      type="text"
                      className={`group-aria-disabled:cursor-not-allowed w-10 text-sm text-center caret-transparent rounded-md border-2 focus-within:border-gray-200 border-b-4 border-gray-200 ${isActive ? " !border-blue-600 border-b-blue-600" : ""}`}
                      id={index}
                      value={otpBoxes[index] ?? ""}
                      onChange={(e) => e.preventDefault()}
                    ></input>
                  );
                })}
            </div>

            <div className="w-full flex flex-col items-center">
              {requestStatus ? (
                <span className="group-aria-disabled:cursor-not-allowed text-center text-gray-400 text-sm">
                  You can request a new OTP code in {secondsBeforeResendOTP}{" "}
                  seconds
                </span>
              ) : (
                <button
                  disabled={!isAvailableResendOTP || isEmailEditted}
                  className="group-aria-disabled:cursor-not-allowed text-blue-500 text-sm opacity-100 disabled:opacity-0"
                >
                  Send new OTP code
                </button>
              )}
            </div>
          </div>
          <SignInButton
            text={"Register"}
            style={
              "w-1/2 max-w-[200px] bg-green-600 hover:bg-green-600/90 m-3 p-2 rounded-md text-white"
            }
          />
          {/* toggle to login form */}
          <span className=" text-gray-700 text-sm w-full flex justify-center">
            Already have an account?&nbsp;
            <Link href="/login" className="text-blue-500">
              Sign In
            </Link>
          </span>
        </form>
      </div>
    </>
  );
}
