import { CloseIcon, Spinner } from "flowbite-react";
import InputElement from "../InputElement";
import { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import z, { ZodError } from "zod";
import ApiInterface from "@/utils/ApiInterface";

const employeeFields = {
  first_name: {
    label: "First Name",
    type: "text",
    required: true,
    name: "firstName",
  },
  last_name: {
    label: "Last Name",
    type: "text",
    required: true,
    name: "lastName",
  },
  parent_first_name: {
    label: "Parent First Name",
    type: "text",
    required: false,
    name: "parentName",
  },
  date_of_birth: {
    label: "Birth Date",
    type: "text",
    required: true,
    name: "birthDate",
  },
};

const customFloatStyle = `-translate-y-[1.25rem] bg-slate-800 left-2 text-white text-sm absolute italic`;

const style = {
  containerStyle: "flex flex-col flex-[0_0_45%] text-gray-100 gap-y-2 relative",
  inputStyle:
    "rounded-md border border-gray-400 focus-visible:outline-none focus:ring-1 focus:border-blue-700 focus:ring-blue-700 px-2 py-2 bg-slate-800 autofill-slate800",
};

const { get, patch } = ApiInterface;

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
        const data =
          (await get(`/employee/find-employee?employeeId=` + employeeId)) || {};
        const shallowEmployeeData = employeeData;
        Object.keys(data).map((fieldName) => {
          console.log({ data });
          if (fieldName === "date_of_birth") {
            shallowEmployeeData[fieldName]["value"] = moment(
              data[fieldName],
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
    try {
      let patchData = {
        id: employeeId,
      };
      for (const key in employeeData) {
        if (!employeeData[key].value) continue;
        patchData = {
          ...patchData,
          [employeeData[key].name]: employeeData[key].value,
        };
      }

      await patch("/employee/edit-employee", patchData);

      toast.success("Employee updated");
      reloadTrigger((p) => !p);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRequestStatus("done");
      setModalVisibility(false);
    }
  }

  function setUserData(name, value) {
    setEmployeeData((employee) => ({
      ...employee,
      [name]: {
        ...employee[name],
        value: value,
      },
    }));
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
                    style={style}
                    customFloatStyle={customFloatStyle}
                    name={employeeField.name}
                    value={employeeField.value}
                    disabled={requestStatus === "fetching"}
                    parrentContentSetter={({ target }) => {
                      setUserData(employeeFieldName, target.value);
                    }}
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
