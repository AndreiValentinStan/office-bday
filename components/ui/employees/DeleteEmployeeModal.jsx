import { Spinner } from "flowbite-react";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import ApiInterface from "@/utils/ApiInterface";

const buttonBaseStyle = `px-3 py-1 rounded-sm`;
const dataGroupStyle = "grid grid-cols-2 text-sm";

export default function DeleteEmployeeModal({
  isModalDisplayed,
  setVisibility,
  data,
  reloadPageTrigger,
}) {
  const [requestState, setRequestState] = useState("idle");
  async function deleteHandler() {
    try {
      setRequestState("fetching");
      await ApiInterface.delete(`/employee/delete-employee/${data.id}`);
      /* const response = await fetch("/api/employee/delete-employee", {
        method: "DELETE",
        headers: {
          "Content-Type": "applicaiton/json",
        },
        body: JSON.stringify({
          id: data.id,
        }),
      }); */
      /* const { success, message } = (await response.json()) || {};
      if (!success) throw Error("Delete error"); */
      /* toast.success(message || "Success!"); */
    } catch (err) {
      console.log(err);
      toast.error(err.messsage);
    } finally {
      setRequestState("done");
      setVisibility(false);
      reloadPageTrigger((t) => !t);
    }
  }
  const birthDate = data.date_of_birth
    ? moment(data.date_of_birth).format("DD MMMM YYYY")
    : "";
  return (
    <section
      className={`w-full h-full right-0 top-0 fixed bg-slate-800/70 select-none flex items-center justify-center ${
        isModalDisplayed ? "visible" : "invisible"
      }`}
    >
      <div className="relative bg-slate-800 flex flex-col px-10 py-5 gap-y-10 rounded-md border border-slate-900/50 w-full md:w-max mx-5 md: m-0">
        <div
          className={`absolute top-0 left-0 bg-slate-900/80 w-full h-full rounded-md flex flex-col justify-center items-center gap-y-3 ${
            requestState === "fetching" ? "visible" : "invisible"
          }`}
        >
          <Spinner className="text-slate-400 fill-blue-500" />
          <span className="text-slate-100">Delete in progress...</span>
        </div>
        {/* loading screen */}
        <h1 className="text-slate-200 text-xl">Delete user</h1>
        <div className="text-slate-200 flex flex-col gap-y-2 ">
          <span className="text-md mb-4">
            You`re about to delete following employee:
          </span>
          <div className={dataGroupStyle}>
            <span>First Name</span>
            <span className="justify-self-center italic">
              {data.first_name}
            </span>
          </div>
          <div className={dataGroupStyle}>
            <span>Last Name</span>
            <span className="justify-self-center italic">{data.last_name}</span>
          </div>
          <div className={dataGroupStyle}>
            <span>Parent First Name</span>
            <span className="justify-self-center italic">
              {data.parent_first_name}
            </span>
          </div>
          <div className={dataGroupStyle}>
            <span>Birth Date</span>
            <span className="justify-self-center italic">{birthDate}</span>
          </div>
        </div>
        {/* controls */}
        {/* question */}
        <span className="italic text-sm text-slate-100 w-full flex justify-center">
          Do you really want to delete employee?
        </span>
        <div className="flex w-full justify-around">
          <button
            onClick={() => setVisibility(false)}
            className={
              buttonBaseStyle +
              " bg-gray-500 text-slate-200 hover:bg-gray-500/70"
            }
          >
            Cancel
          </button>
          <button
            onClick={deleteHandler}
            className={
              buttonBaseStyle +
              " bg-red-600 text-slate-200 hover:bg-red-700 hover:text-white"
            }
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}
