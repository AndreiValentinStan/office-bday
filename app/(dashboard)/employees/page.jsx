"use client";

import { useEffect, useState } from "react";
import Filter from "../../../components/ui/filters/Filter";
import EmployeesTable from "../../../components/ui/employees/EmployeesTable";
import PageCounter from "../../../components/ui/employees/PageCounter";
import OutsideWrapper from "../../../components/hooks/OutsideClick";
import AddEmployeesModal from "../../../components/ui/employees/AddEmployeeModal";
import PaginationController from "../../../components/ui/pagination/PaginationController";
import VisibleColumns from "@/components/ui/employees/VisibleColumns";

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
        searchParam: "first_name",
      },
      {
        label: "Last Name",
        inputType: "text",
        searchParam: "last_name",
      },
      {
        label: "Birth Date",
        inputType: "text",
        searchParam: "date_of_birth",
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
      const { success, data: recvData, error } = data || {};
      console.log(recvData);

      if (!success) throw Error("Error in fetching employees");
      setEmployees({
        count: recvData.employees.count,
        employees: recvData.employees.employees,
      });
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }

  // page size
  const [pageSize, setPageSize] = useState(20);

  // page number
  const [pageNumber, setPageNumber] = useState(1);

  // modify page size handler
  function pageSizeHandler(e) {
    setPageSize(e.target.value);
  }

  // trigger fetch employees
  useEffect(() => {
    fetchEmployees();
  }, [pageSize, triggerFilter, pageNumber]);

  // visible columns
  const displayColumns = [
    { name: "First Name", alias: "first_name", display: true },
    { name: "Last Name", alias: "last_name", display: true },
    { name: "Parent Name", alias: "parent_first_name", display: true },
    { name: "Birth Date", alias: "date_of_birth", display: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(displayColumns);

  function visibilityHandler({ target }) {
    setVisibleColumns((prev) =>
      prev.map((column) => {
        return target.id === column.alias
          ? { ...column, display: !column.display }
          : column;
      })
    );
  }

  console.log({employees});

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
        <VisibleColumns
          columnsArray={visibleColumns}
          visibilityHandler={(e) => visibilityHandler(e)}
        />

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
              visibleColumns={visibleColumns}
              currentPage={pageNumber - 1}
              resultsPerPage={pageSize}
            >
              <PageCounter setPageSize={pageSizeHandler} pageSize={pageSize} />
            </EmployeesTable>
          </OutsideWrapper>
        </section>

        {/* pagination */}
        <PaginationController
          currentPage={pageNumber}
          totalCount={Math.ceil(employees?.count / pageSize) || 0}
          changePageHandler={(num) => setPageNumber(num)}
        />
      </div>
      {/* add employees modal */}
      <AddEmployeesModal
        setIsModalDisplayed={setShowAddEmployeesModal}
        isModalDisplayed={showAddEmployeesModal}
      />
    </>
  );
}
