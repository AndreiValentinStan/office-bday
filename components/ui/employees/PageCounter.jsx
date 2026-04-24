"use client";

export default function PageCounter({ setPageSize, pageSize, employeesCount }) {
  return (
    <>
      <div className="flex justify-between items-center">
        <span className={"font-semibold text-md uppercase"}>Employees {employeesCount}</span>
        <div className="text-sm flex gap-x-3 items-center text-gray-500">
          <span>Rows per page</span>
          <select
            className="px-2 py-1 rounded-sm focus-visible:outline-none hover:cursor-pointer"
            onChange={setPageSize}
            defaultValue={pageSize}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </>
  );
}
