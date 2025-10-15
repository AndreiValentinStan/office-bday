import pagination from "../../../utils/paginationRenderer";

export default function PaginationController({ totalCount, currentPage }) {
  const pages = pagination(currentPage, totalCount);
  return (
    <div className="w-full flex justify-center items-center ">
      <span className="px-1 py-1 mx-1 rounded-sm leading-none text-blue-500 hover:cursor-pointer hover:text-blue-700 hover:border-blue-400 border border-transparent">{"<<"}</span>
      {pages.map((pageNumber, index) => {
        return Number.isInteger(Number(pageNumber)) ? <span
            className="px-2 py-1 mx-1 rounded-sm leading-none aria-disabled:hover:cursor-pointer bg-blue-600 text-gray-100 aria-disabled:bg-gray-100 aria-disabled:border-none aria-disabled:text-gray-700 aria-disabled:hover:bg-gray-200 aria-disabled:hover:text-gray-800"
            aria-disabled={pageNumber !== currentPage}
            key={index}
          >
            {pageNumber}
          </span> : <span className="mx-1" key={index}>{pageNumber}</span>
      })}
      <span className="px-1 py-1 mx-1 rounded-sm leading-none text-blue-500 hover:cursor-pointer hover:text-blue-700 hover:border-blue-400 border border-transparent">{">>"}</span>
    </div>
  );
}
