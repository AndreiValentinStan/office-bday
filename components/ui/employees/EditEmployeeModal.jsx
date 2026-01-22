import { CloseIcon, Spinner } from "flowbite-react";
import InputElement from "../InputElement";
import { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import z, { ZodError } from "zod";

const employeeFields = {
  first_name: {
    label: "First Name",
    type: "text",
    required: true,
    name: "first_name",
  },
  last_name: {
    label: "Last Name",
    type: "text",
    required: true,
    name: "last_name",
  },
  parent_first_name: {
    label: "Parent First Name",
    type: "text",
    required: false,
    name: "parent_first_name",
  },
  date_of_birth: {
    label: "Birth Date",
    type: "text",
    required: true,
    name: "date_of_birth",
  },
};

const fieldStyle = {
  containerStyle: "flex flex-col flex-[0_0_45%] text-gray-100 gap-y-2 relative",
  inputStyle:
    "rounded-md border border-gray-400 focus-visible:outline-none focus:ring-1 focus:border-blue-700 focus:ring-blue-700 px-2 py-2 bg-slate-800 autofill-slate800",
};

const customFloatStyle = `-top-3 bg-slate-800 left-2 px-1 text-white text-sm absolute italic rounded-sm`;
const customDefaultStyle = `top-1/2 -translate-y-1/2 left-4 text-gray-100 text-md absolute italic`;

import { updateEmployeeDataSchema as employeeDataSchema } from "../../../validators/employee";

export default function EditEmployeeModal({
  isModalDisplayed,
  employeeId,
  setModalVisibility,
  reloadTrigger,
}) {
  const [employeeData, setEmployeeData] = useState(employeeFields);
  const [loadingState, setLoadingState] = useState("uninitiated");
  const [requestStatus, setRequestStatus] = useState("done");
  useEffect(() => {
    async function getEmployeeData() {
      setLoadingState("fetching");
      try {
        const response = await fetch(
          `/api/employee/find-employee?employeeId=` + employeeId
        );
        const { success, data, error } = (await response.json()) || {};
        if (!success) throw Error(error?.message);
        const shallowEmployeeData = employeeData;
        Object.keys(data).map((fieldName) => {
          console.log({ data });
          if (fieldName === "date_of_birth") {
            shallowEmployeeData[fieldName]["value"] = moment(
              data[fieldName]
            ).format("DD-MM-YYYY");
          } else shallowEmployeeData[fieldName]["value"] = data[fieldName];
          return employeeFields[fieldName];
        });
        setEmployeeData(shallowEmployeeData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingState("done");
      }
    }
    getEmployeeData();
  }, []);

  async function submitHandler(e) {
    e.preventDefault();
    setRequestStatus("fetching");
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.id = employeeId;
    try {
      employeeDataSchema.parse(data);
      const response = await fetch("/api/employee/edit-employee", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const { success, message } = (await response.json()) || {};
      if (!success) throw Error("Unknown error");
      reloadTrigger((p) => !p);
      toast.success(message);
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach((error) => {
          toast.error(error.message + " Reason: " + error.path);
        });
      } else toast.error("Ups, some error occured!");
    } finally {
      setRequestStatus("done");
      setModalVisibility(false);
    }
  }

  return (
    <section
      className={`w-full h-full right-0 top-0 fixed bg-slate-800/70 select-none flex items-center justify-center ${
        isModalDisplayed ? "visible" : "invisible"
      }`}
    >
      <form
        className="relative bg-slate-800 flex flex-col px-10 py-5 gap-y-10 rounded-md border border-slate-900/50 max-w-[50%] transition-[width] duration-300"
        onSubmit={submitHandler}
      >
        <h1 className="text-xl text-white">Edit User</h1>
        {/* close button */}
        <div className="absolute right-4 top-4 p-1 border border-slate-300 rounded-md hover:cursor-pointer">
          <CloseIcon
            className="text-slate-300 text-xl "
            onClick={() => setModalVisibility(false)}
          ></CloseIcon>
        </div>
        {/* user info */}
        {loadingState === "done" ? (
          <>
            <div className="flex gap-x-3 gap-y-5 flex-wrap justify-center">
              {Object.keys(employeeData).map((employeeFieldName, index) => {
                const employeeField = employeeData[employeeFieldName];

                return (
                  <InputElement
                    key={index}
                    label={employeeField.label}
                    inputType={employeeField.type}
                    floatEffect={true}
                    required={employeeField.required}
                    style={fieldStyle}
                    customFloatStyle={customFloatStyle}
                    customDefaultStyle={customDefaultStyle}
                    name={employeeField.name}
                    value={employeeField.value}
                    disabled={requestStatus === "fetching"}
                  />
                );
              })}
            </div>
            <button
              className="bg-blue-500 text-white py-1.5 rounded-md hover:bg-blue-500/90 w-0 min-w-fit px-4 m-auto"
              type="submit"
            >
              {requestStatus === "fetching" ? "Loading..." : "Apply Changes"}
            </button>
          </>
        ) : (
          <div className="w-52 h-60 flex items-center justify-center flex-col gap-y-3">
            <Spinner className="fill-blue-500 text-slate-700/20" />
            <span className="text-slate-300">Fetching data...</span>
          </div>
        )}
      </form>
    </section>
  );
}
