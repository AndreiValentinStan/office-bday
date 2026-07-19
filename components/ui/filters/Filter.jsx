"use client";

import { useState } from "react";
import FilterField from "./FilterField";
import DateFilter from './DateFilter';

export default function Filter({
  filters,
  handleFilterDispatch,
  resetFilters,
}) {
  const [filterValue, setFilterValue] = useState({})
  function valueChangeHanlder(name, value){
    setFilterValue(f => ({...f, [name]: value}))
  }
  return (
    <form className="flex flex-wrap gap-y-5 justify-center gap-x-5 border border-gray-200 p-6 rounded-md">
      {filters.filters.map((filter, index) => {
        switch(filter.inputType){
          case 'date':
            return <DateFilter key={index} setFieldValue={valueChangeHanlder} fieldValue={filterValue[filter?.searchParam]} searchParam={filter.searchParam}/>
          default:
            return <FilterField
            key={index}
            label={filter.label}
            inputType={filter.inputType}
            setFieldValue={/* handleFliterChange */valueChangeHanlder}
            fieldValue={/* filterState[filter.searchParam] */filterValue[filter?.searchParam] || ''}
            searchParam={filter.searchParam}
          />
        }
      })}
      <button
        className="text-white bg-blue-500 px-10 py-1 rounded-sm hover:bg-blue-600"
        onClick={e => handleFilterDispatch(e, filterValue)}
      >
        Filter
      </button>
      <button
        className="text-white bg-gray-500 px-10 py-1 rounded-sm hover:bg-gray-600"
        onClick={(e) => {
          setFilterValue(f => ({}));
          resetFilters(e);
        }}
      >
        Reset
      </button>
    </form>
  );
}
