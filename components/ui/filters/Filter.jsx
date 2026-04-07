"use client";

import FilterField from "./FilterField";

export default function Filter({
  filters,
  filterState,
  handleFliterChange,
  handleFilterDispatch,
  resetFilters,
}) {
  return (
    <form className="flex flex-wrap gap-y-5 justify-center gap-x-5 border border-gray-200 p-6 rounded-md">
      {filters.filters.map((filter, index) => {
        return (
          <FilterField
            key={index}
            label={filter.label}
            inputType={filter.inputType}
            setFieldValue={handleFliterChange}
            fieldValue={filterState[filter.searchParam]}
            searchParam={filter.searchParam}
          />
        );
      })}
      <button
        className="text-white bg-blue-500 px-10 py-1 rounded-sm hover:bg-blue-600"
        onClick={handleFilterDispatch}
      >
        Filter
      </button>
      <button
        className="text-white bg-gray-500 px-10 py-1 rounded-sm hover:bg-gray-600"
        onClick={resetFilters}
      >
        Reset
      </button>
    </form>
  );
}
