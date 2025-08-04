"use client";

import { useEffect, useState } from "react";
import Filter from "../../components/ui/filters/Filter";
import EmployeesTable from "../../components/ui/employees/EmployeesTable";
import PageCounter from "../../components/ui/employees/PageCounter";
import OutsideWrapper from "../../components/hooks/OutsideClick";
import AddEmployeesModal from "../../components/ui/employees/AddEmployeeModal";

export default function Employees() {
  const sectionsStyle = "w-full bg-gray-100 p-4 rounded-sm";
  const titleStyle = "font-semibold text-md uppercase";
  const [clickOutside, setClickOutside] = useState(false);
  const [showAddEmployeesModal, setShowAddEmployeesModal] = useState(false);

  // filter
  // filter state
  const [filterState, setFilterState] = useState({});
  const [triggerFilter, setTriggerFilter] = useState(false);
  // filter handler
  const filterChangeHandler = ({ target }, label) => {
    setFilterState((s) => ({ ...s, [label]: target.value }));
  };
  // filter dispatch handler
  function handleFilterDispatch(e) {
    e.preventDefault();
    if (Object.entries(filterState).length > 0) setTriggerFilter((t) => !t);
  }
  function resetFilterHandler(e) {
    e.preventDefault();
    setFilterState({});
    setTriggerFilter((t) => !t);
  }
  // filter initialization
  const filters = {
    filters: [
      {
        label: "First Name",
        inputType: "text",
        searchParam: "firstName",
      },
      {
        label: "Last Name",
        inputType: "text",
        searchParam: "lastName",
      },
      {
        label: "Birth Date",
        inputType: "text",
        searchParam: "birthDate",
      },
    ],
  };

  // employees
  const [employees, setEmployees] = useState({});
  // employees loading status
  const [isLoading, setIsLoading] = useState(false);
  // fetch employees
  async function fetchEmployees() {
    setIsLoading(true);
    try {
      let searchQuery = "";
      for (const [key, value] of Object.entries(filterState)) {
        if (searchQuery.length > 0) searchQuery += "&";
        searchQuery += key.toString() + "=" + value.toString();
      }
      const response = await fetch(
        `/api/employee/get-employees?count=${pageSize}&page=${pageNumber}${
          searchQuery.length > 0 ? `&${searchQuery}` : ``
        }`
      );
      console.log(response);
      if (!response.ok) throw Error("Error in fetching employees!");
      const data = await response.json();
      setEmployees((e) => ({
        ...e,
        count: data.count,
        employees: data.employees,
      }));
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }

  // page size
  const [pageSize, setPageSize] = useState(20);

  // modify page size handler
  function pageSizeHandler(e) {
    setPageSize(e.target.value);
  }

  // page number
  const [pageNumber, setPageNumber] = useState(1);

  // trigger fetch employees
  useEffect(() => {
    fetchEmployees();
  }, [pageSize, triggerFilter]);

  return (
    <>
      <div className="w-full h-dvh p-8 flex flex-col gap-y-2 overflow-y-scroll relative select-none">
        {/* header */}
        <header
          className={`${sectionsStyle} flex justify-between items-center`}
        >
          <span className="uppercase text-lg font-semibold">
            Employees manager
          </span>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-sm"
            onClick={() => setShowAddEmployeesModal(true)}
          >
            Add Employees
          </button>
        </header>

        {/* visible columns */}
        <section className={sectionsStyle}>
          <span className={titleStyle}>visible columns</span>
          <div className="flex">
            <div className="flex gap-x-2 m-4">
              <input type="checkbox"></input>
              <label>First Name</label>
            </div>
            <div className="flex gap-x-2 m-4">
              <input type="checkbox"></input>
              <label>Last Name</label>
            </div>
            <div className="flex gap-x-2 m-4">
              <input type="checkbox"></input>
              <label>Parent First Name</label>
            </div>
            <div className="flex gap-x-2 m-4">
              <input type="checkbox"></input>
              <label>Birth Date</label>
            </div>
            <div className="flex gap-x-2 m-4">
              <input type="checkbox"></input>
              <label>Age</label>
            </div>
          </div>
        </section>

        {/* filters */}
        <section className={`${sectionsStyle} flex flex-col gap-y-5`}>
          {/* section title */}
          <span className={titleStyle}>Filters</span>

          {/* filter unit */}
          <Filter
            filters={filters}
            filterState={filterState}
            handleFliterChange={filterChangeHandler}
            handleFilterDispatch={handleFilterDispatch}
            resetFilters={resetFilterHandler}
          ></Filter>
        </section>

        {/* employees list */}
        <section className={`${sectionsStyle} flex flex-col gap-y-5`}>
          <OutsideWrapper stateHanlder={setClickOutside}>
            <EmployeesTable
              employees={employees}
              loadingStatus={isLoading}
              clickOutside={clickOutside}
              setClickOutside={setClickOutside}
            >
              <PageCounter setPageSize={pageSizeHandler} pageSize={pageSize} />
            </EmployeesTable>
          </OutsideWrapper>
        </section>

        {/* pagination */}
        <section className="w-min relative left-1/2 -translate-x-1/2 gap-x-2 flex">
          <span>{"<"}</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>{">"}</span>
        </section>
      </div>
      {/* add employees modal */}
      <AddEmployeesModal setIsModalDisplayed={setShowAddEmployeesModal} isModalDisplayed={showAddEmployeesModal}/>
    </>
  );
}
