"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import InputElement from "../InputElement";
import z, { ZodError } from "zod";
import { firstNameSchema } from "../../../validators/firstName";
import { lastNameSchema } from "../../../validators/lastName";
import { phoneSchema } from "../../../validators/phone";
import { passwordSchema } from "../../../validators/passwordSchema";
import UpdateProfileLoadingScreen from "../../../components/ui/loading screen/UpdateProfileLoadingScreen";
import { useAuth } from "../../../hooks/auth";
import ApiInterface from "../../../utils/ApiInterface";
import toast from "react-hot-toast";

const customStyle = {
  containerStyle:
    "flex flex-col w-full text-gray-800 gap-y-2 relative dark:text-gray-100 max-w-md",
  inputStyle:
    "rounded-md border border-gray-400 h-8 focus-visible:outline-none focus:ring-1 focus:border-blue-700 focus:ring-blue-700 p-2 dark:bg-slate-800 text-md py-5 disabled:text-gray-500 disabled:bg-gray-100",
};

const validator = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  phone: phoneSchema.optional(),
  actualPassword: passwordSchema.optional(),
  newPassword: passwordSchema.optional(),
});

export default function ProfileForm() {
  const authContext = useAuth();

  const {
    firstName: ctxFirstName,
    lastName: ctxLastName,
    email: ctxEmail,
    phone: ctxPhone,
  } = authContext || {};
  const userProfileInfo = useMemo(() => {
    return authContext.getUserInfo("firstName", "lastName", "email", "phone");
  }, [ctxFirstName, ctxLastName, ctxEmail, ctxPhone]);

  const { patch } = ApiInterface;

  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [validatorErrors, setValidatorErrors] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const shouldUpdateRef = useRef(false);

  function updateShouldUpdate(value) {
    shouldUpdateRef.current = value;
    setShouldUpdate(value);
  }

  function setData({ target }) {
    // check if profile info are changed
    let dirtyFlag = false; // this flag indicates if form was changed

    const userDataSyncCopy = { ...userData, [target.name]: target.value };

    for (const key in userDataSyncCopy) {
      if (userDataSyncCopy[key] !== userProfileInfo[key]) {
        dirtyFlag = true;
        break;
      }
    }

    updateShouldUpdate(dirtyFlag);

    return setUserData((prev) => ({ ...prev, [target.name]: target.value }));
  }

  const profileLabels = [
    {
      label: "First Name",
      name: "firstName",
      inputType: "text",
      floatEffect: true,
      style: customStyle,
      value: Object.hasOwn(userData, "firstName")
        ? userData?.firstName
        : userProfileInfo.firstName,
      validationError: validatorErrors?.firstName || "",
    },
    {
      label: "Last Name",
      name: "lastName",
      inputType: "text",
      floatEffect: true,
      style: customStyle,
      value: Object.hasOwn(userData, "lastName")
        ? userData?.lastName
        : userProfileInfo.lastName,
    },
    {
      label: "Email",
      name: "email",
      inputType: "text",
      disabled: true,
      floatEffect: true,
      value: Object.hasOwn(userData, "email")
        ? userData?.email
        : userProfileInfo.email,
      style: customStyle,
    },
    {
      label: "Phone",
      name: "phone",
      type: "number",
      floatEffect: true,
      style: customStyle,
      value: Object.hasOwn(userData, "phone")
        ? userData?.phone
        : userProfileInfo.phone,
    },
    {
      label: "Actual Password",
      name: "actualPassword",
      inputType: "password",
      floatEffect: true,
      style: customStyle,
      value: userData?.actualPassword || "",
    },
    {
      label: "New Password",
      name: "newPassword",
      inputType: "password",
      floatEffect: true,
      style: customStyle,
      value: userData?.newPassword || "",
    },
  ];

  async function updateProfileHandler() {
    if (!shouldUpdateRef.current) {
      toast("Nothing to save!");
      return;
    }
    try {
      // validate form info
      setIsLoading(true);
      const validatedUserData = validator
        .refine(
          ({ actualPassword, newPassword }) => {
            if (actualPassword || newPassword) {
              if (!actualPassword || !newPassword) return false;
            }
            return true;
          },
          {
            message:
              "You must provide values for all Actual Password and New Password",
          },
        )
        .parse(userData);

      // call update profile endpoint
      const { user } = await patch("/user/update-user/me", {
        ...validatedUserData,
      });

      authContext.updateUserData({ ...user });
      setUserData({});
      toast.success('Profile updated succesfully')
    } catch (err) {
      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);
        return;
      }
      toast.error(err.message);
    } finally {
      updateShouldUpdate(false);
      setUserData({})
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex flex-wrap w-full gap-x-4 gap-y-10 justify-center py-6">
      {isLoading && <UpdateProfileLoadingScreen />}
      {profileLabels.map((profileLabel, index) => {
        return (
          <InputElement
            key={index}
            {...profileLabel}
            parrentContentSetter={setData}
          />
        );
      })}
      <button
        onClick={updateProfileHandler}
        className="bg-blue-500 px-20 py-2 text-sm text-white rounded-md disabled:bg-blue-200 hover:bg-blue-600"
        disabled={!shouldUpdate}
      >
        Save changes
      </button>
    </div>
  );
}
