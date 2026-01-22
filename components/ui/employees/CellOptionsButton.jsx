import { HiOutlineDotsVertical } from "react-icons/hi";

export default function CellOptionsButton({ id, display, employeeId }) {
  const optionStyle = "hover:bg-blue-800 px-4 py-2 hover:cursor-pointer";

  return (
    <div className="relative">
      <button value={id} id="cell-options-button">
        <HiOutlineDotsVertical
          size={"24px"}
          className="bg-blue-100 text-xs rounded-sm p-1 text-blue-700 hover:cursor-pointer pointer-events-none"
        />
      </button>
      {display === id && (
        <>
          <div>
            <div
              className={`bg-blue-700 absolute z-10 text-white gap-y-2 flex flex-col`}
            >
              <span className={optionStyle} id={`edit_${employeeId}`}>
                Edit
              </span>
              <span className={optionStyle} id={`delete_${employeeId}`}>
                Delete
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
