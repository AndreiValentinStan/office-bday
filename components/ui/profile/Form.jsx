"use client";

import { useEffect, useMemo, useState } from "react";
import InputElement from "../InputElement";
import z, { ZodError } from "zod";
import { firstNameSchema } from "../../../validators/firstName";
import { lastNameSchema } from "../../../validators/lastName";
import { phoneSchema } from "../../../validators/phone";
import { passwordSchema } from "../../../validators/passwordSchema";

const customStyle = {
  containerStyle:
    "flex flex-col w-full text-gray-800 gap-y-2 relative dark:text-gray-100 max-w-md",
  inputStyle:
    "rounded-md border border-gray-400 h-8 focus-visible:outline-none focus:ring-1 focus:border-blue-700 focus:ring-blue-700 p-2 dark:bg-slate-800 text-md py-5",
};
/* const customFloatStyle = '' */

/* const profileLabels = [
  {
    label: "First Name",
    name: "firstName",
    type: "text",
    floatEffect: true,
    style: customStyle,
    // customFloatStyle
  },
  {
    label: "Last Name",
    name: "lastName",
    type: "text",
    floatEffect: true,
    style: customStyle,
  },
  {
    label: "Email",
    name: "email",
    type: "text",
    disabled: true,
    floatEffect: true,
    value: "test@email.com",
    style: customStyle,
  },
  {
    label: "Phone",
    name: "phone",
    type: "number",
    floatEffect: true,
    style: customStyle,
  },
  {
    label: "Actual Password",
    name: "actualPassword",
    type: "password",
    floatEffect: true,
    style: customStyle,
  },
  {
    label: "New Password",
    name: "newPassword",
    type: "password",
    floatEffect: true,
    style: customStyle,
  },
]; */

const validator = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
  actualPassword: passwordSchema.optional(),
  newPassword: passwordSchema.optional(),
});

export default function ProfileForm({ firstName, lastName, email, phone }) {
  const [userData, setUserData] = useState({
    firstName,
    lastName,
    email,
    phone,
  });
  const [validatorErrors, setValidatorErrors] = useState([]);

  function setData({ target }) {
    try {
      const data = validator.parse({
        [target.name]: target.value,
      });
      console.log({ ...data });
      return setUserData((prev) => ({ ...prev, ...data }));
    } catch (err) {
        if(err instanceof ZodError){
            console.log(err.issues);
        }
    }
  }

  const profileLabels = useMemo(() => {
    return [
      {
        label: "First Name",
        name: "firstName",
        inputType: "text",
        floatEffect: true,
        style: customStyle,
        value: userData?.firstName || "",
        validationError: validatorErrors?.firstName || "",
      },
      {
        label: "Last Name",
        name: "lastName",
        inputType: "text",
        floatEffect: true,
        style: customStyle,
        value: userData?.lastName || "",
      },
      {
        label: "Email",
        name: "email",
        inputType: "text",
        disabled: true,
        floatEffect: true,
        value: userData?.email || "test@email.com",
        style: customStyle,
      },
      {
        label: "Phone",
        name: "phone",
        type: "number",
        floatEffect: true,
        style: customStyle,
        value: userData?.phone,
      },
      {
        label: "Actual Password",
        name: "actualPassword",
        inputType: "password",
        floatEffect: true,
        style: customStyle,
        value: userData?.password || "",
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
  }, [firstName, lastName, email, phone]);
  return (
    <div className="flex flex-wrap w-full gap-x-4 gap-y-10 justify-center py-6">
      {profileLabels.map((profileLabel) => {
        return (
          <InputElement {...profileLabel} parrentContentSetter={setData} />
        );
      })}
      <button className="bg-red-500 px-20 py-2 text-sm text-white rounded-md">
        Save changes
      </button>
    </div>
  );
}
