import ApiInterface from "@/utils/ApiInterface";
import { CloseIcon, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

const employeeSchema = {
  first_name: "",
  last_name: "",
  parent_name: "",
  date_of_birth: "",
};

export default function AddEmployeeModal({
  isModalDisplayed,
  setIsModalDisplayed,
  setChangesTracker,
}) {
  const [employeesFile, setEmployeesFile] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [employee, setEmployee] = useState(employeeSchema);

  function handleEmployeesData({ target }) {
    setEmployee((prev) => ({
      ...prev,
      [target.id]: target.value,
    }));
  }

  const handleCreateEmployee = async () => {
    setIsLoading(true);
    try {
      const body = JSON.stringify({
        firstName: employee.first_name,
        lastName: employee.last_name,
        birthDate: employee.date_of_birth,
        ...(parent_name && { parentName: employee.parent_name }),
      });
      const resp = await fetch(`/api/employee/add-employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      const { success, error } = await resp.json();
      if (!success) throw Error(`${error.message} --> ${error?.reason}`);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setEmployee(employeeSchema);
      setIsModalDisplayed(false);
      setChangesTracker((prev) => !prev);
    }
  };

  async function uploadEmployeesHandler() {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("employeesFile", employeesFile);
      /* const response = await fetch("/api/employee/add-bulk", {
        method: "POST",
        body: formData,
      }); */
      const { success, error } = await ApiInterface.post('/employee/add-bulk', formData);
      console.log(success, error);
      if (!success) throw Error(`${error.message} ---> ${error?.data}`);
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      /* setEmployeesFile(null);
      setFileInput
      setIsModalDisplayed(false); */
      closeModalHandler()
      setChangesTracker((prev) => !prev);
    }
  }

  function closeModalHandler(){
    // clean-up rezidual data
    setFileInput(null);
    setEmployeesFile(null);
    setEmployee(employeeSchema);
    setIsModalDisplayed(false);
  }

  return (
    <section
      className={`w-full h-full right-0 top-0 fixed select-none ${
        isModalDisplayed ? "visible" : "invisible"
      }`}
    >
      <div
        className={`w-full h-full bg-white ${
          isModalDisplayed ? "opacity-80" : "opacity-0"
        }`}
      ></div>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden transition-all duration-300 ease-in-out ${
          isModalDisplayed ? "w-full h-full" : "w-0 h-0"
        }`}
      >
        <div className="w-10/12 min-w-[1300px] min-h-[650px] absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[1px] border-blue-500 rounded-md flex gap-x-10 items-center justify-around p-4">
          {/* close button */}
          <div
            onClick={closeModalHandler}
            className="absolute right-1 top-1 text-gray-400 hover:text-gray-600 hover:cursor-pointer hover:bg-gray-100 p-0 rounded-md transition border "
          >
            <IoIosClose size={"30px"} />
          </div>
          {/* loading screen */}
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-full z-10 bg-gray-100/80 flex flex-col items-center justify-center gap-y-5">
              <Spinner size="xl" className="fill-blue-500 text-transparent" />
              <span className="text-2xl italic text-slate-900/75">
                Loading, please wait!
              </span>
            </div>
          )}
          {/* add employee */}
          <div className="w-full h-full flex flex-col items-center justify-center gap-y-8 relative py-6 px-2 text-slate-700 border border-gray-200 rounded-sm">
            <div className="absolute w-full h-full bg-gray-50 opacity-10 -z-10"></div>
            <h1 className=" text-xl">Add employee</h1>
            <div className="flex gap-y-2 flex-col w-4/5 text-sm">
              {/* first name */}
              <div className="flex w-full items-center">
                <label className="w-[40%]">First Name</label>
                <input
                  id="first_name"
                  className="w-full p-1 border border-blue-300 rounded-sm focus-visible:outline-blue-500 focus-visible:border-blue-200"
                  onChange={(e) => handleEmployeesData(e)}
                  value={employee.first_name}
                ></input>
              </div>
              <div className="flex w-full items-center">
                <label className="w-[40%]">Last Name</label>
                <input
                  id="last_name"
                  className="w-full p-1 border border-blue-300 rounded-sm   focus-visible:outline-blue-500 focus-visible:border-blue-200"
                  onChange={(e) => handleEmployeesData(e)}
                  value={employee.last_name}
                ></input>
              </div>
              <div className="flex w-full items-center">
                <label className="w-[40%]">Parent Name</label>
                <input
                  id="parent_name"
                  className="w-full p-1 border border-blue-300 rounded-sm   focus-visible:outline-blue-500 focus-visible:border-blue-200"
                  onChange={(e) => handleEmployeesData(e)}
                  value={employee.parent_name}
                ></input>
              </div>
              <div className="flex w-full items-center">
                <label className="w-[40%]">Birth Date</label>
                <input
                  id="date_of_birth"
                  className="w-full p-1 border border-blue-300 rounded-sm   focus-visible:outline-blue-500 focus-visible:border-blue-200"
                  onChange={(e) => handleEmployeesData(e)}
                  value={employee.date_of_birth}
                ></input>
              </div>
            </div>
            <div>
              <button
                className="bg-blue-500 text-white p-2 rounded-sm hover:bg-blue-600"
                onClick={handleCreateEmployee}
              >
                Add employee
              </button>
            </div>
          </div>
          {/* separator */}
          <div className="h-96 border-r-[1px] border-gray-300">
            <h1 className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white">
              OR
            </h1>
          </div>
          {/* import employees */}
          <div className="w-full h-full flex flex-col items-center justify-center gap-y-11 py-7 relative text-slate-700 border border-gray-200 rounded-sm">
            <div className="absolute w-full h-full bg-gray-50 opacity-10 -z-10"></div>
            <h1 className="text-xl">Import employee</h1>
            <div className="flex flex-col gap-y-3 items-center">
              <p>Please select an .csv file to upload</p>
              <label
                htmlFor="file_upload"
                className="bg-gray-200 px-5 py-2 rounded-md hover:bg-gray-300 hover:cursor-pointer"
              >
                Choose file
              </label>
              <input
                className="opacity-0 absolute  w-0 h-0"
                type="file"
                id="file_upload"
                key={employeesFile ? 'completed' : 'incompleted'}
                accept=".csv"
                onChange={(i) => {
                  console.log(i);
                  if (i.target.files.length === 1) {
                    setEmployeesFile(i.target.files[0]);
                    setFileInput(i.target);
                  }
                }}
              ></input>
              <div className="relative border border-slate-200 px-2 py-2 rounded-md">
                {employeesFile && (
                  <div
                    onClick={() => {
                      setEmployeesFile(null);
                      fileInput.value = "";
                      setFileInput(null);
                    }}
                    className="absolute -right-2 -top-2 text-center bg-slate-200 rounded-xl w-5 h-5 hover:cursor-pointer"
                  >
                    <CloseIcon className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                )}
                <p>
                  {employeesFile
                    ? `${employeesFile.name.toString()}`
                    : "No file selected"}
                </p>
              </div>
            </div>
            <button
              onClick={uploadEmployeesHandler}
              className="bg-blue-500 px-5 py-2 rounded-sm text-white focus-within:outline-none hover:bg-blue-600"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
