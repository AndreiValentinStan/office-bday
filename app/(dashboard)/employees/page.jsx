"use client";

import { useEffect, useRef, useState } from "react";
import Filter from "../../../components/ui/filters/Filter";
import EmployeesTable from "../../../components/ui/employees/EmployeesTable";
import PageCounter from "../../../components/ui/employees/PageCounter";
import OutsideWrapper from "../../../components/hooks/OutsideClick";
import AddEmployeesModal from "../../../components/ui/employees/AddEmployeeModal";
import EditEmployeeModal from "../../../components/ui/employees/EditEmployeeModal";
import DeleteEmployeeModal from "../../../components/ui/employees/DeleteEmployeeModal";
import PaginationController from "../../../components/ui/pagination/PaginationController";
import VisibleColumns from "@/components/ui/employees/VisibleColumns";
import api from "../../../utils/ApiInterface";

export default function Employees() {
  const sectionsStyle = "w-full bg-gray-100 p-4 rounded-sm";
  const titleStyle = "font-semibold text-md uppercase";
  const [clickOutside, setClickOutside] = useState(false);
  const [showAddEmployeesModal, setShowAddEmployeesModal] = useState(false);

  const [changesTracker, setChangesTracker] = useState(false);

  // employee modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmployeeData, setDeleteEmployeeData] = useState({});

  // filter
  // filter state
  const [filterState, setFilterState] = useState({});
  const [triggerFilter, setTriggerFilter] = useState(false);

  // new filter state
  const filterStateRef = useRef({page: 1, count: 20});

  // filter handler
  const filterChangeHandler = (changes) => {
    if(filterStateRef.current)
      filterStateRef.current = {...filterStateRef.current, ...changes}
  };

  // filter dispatch handler
  function handleFilterDispatch(event, filtersValue) {
    event.preventDefault();
    filterChangeHandler({...filtersValue, page: 1, count: 20});
    setPageNumber(1);
    setPageSize(20);
    if (Object.entries(filterStateRef.current).length > 0) setTriggerFilter((t) => !t);
  }
  function resetFilterHandler(e) {
    e.preventDefault();
    filterStateRef.current = {page: 1, count: 20}
    setPageNumber(1);
    setPageSize(20);
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
      for (const [key, value] of Object.entries(filterStateRef.current)) {
        if (searchQuery.length > 0) searchQuery += "&";
        searchQuery += key.toString() + "=" + value.toString();
      }
      const {
        employees: { count, employees },
      } = await api.get(
        `/employee/get-employees${Object.keys(filterStateRef.current).length ? '?' : ''}${
          searchQuery.length > 0 ? `${searchQuery}` : ``
        }`,
      );
      setEmployees({
        count,
        employees,
      });
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }

  // page size
  const [pageSize, setPageSize] = useState(20);

  function pageSizeHandler({target}){
    filterStateRef.current = {...filterStateRef.current, count: target?.value || 20, page: 1};
    setPageNumber(1);
    setPageSize(target?.value || 20);
  }

  // page number
  const [pageNumber, setPageNumber] = useState(1);

  // modify page size handler
  function pageNumberHandler(value) {
    console.log(value);
    filterStateRef.current = {...filterStateRef.current, page: value || 1};
    setPageNumber(value || 1);
  }

  // trigger fetch employees
  useEffect(() => {
    fetchEmployees();
  }, [triggerFilter, pageSize, pageNumber]);

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
      }),
    );
  }

  return (
    <>
      <div
        className="w-full h-full p-1 md:p-8 pb-5 flex flex-col gap-y-2 relative select-none overflow-auto"
        onClick={(e) => {
          if (e.target.id.includes("edit")) {
            setEditEmployeeId(e.target.id.split("_")[1]);
            setShowEditModal(true);
          }
          if (e.target.id.includes("delete")) {
            console.log({ employees });
            const id = e.target.id.split("_")[1];
            const employeeToDelete = employees.employees.find(
              (employee) => employee.id === id,
            );
            if (employeeToDelete) {
              setDeleteEmployeeData(employeeToDelete);
              setShowDeleteModal(true);
            }
          }
        }}
      >
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
          changePageHandler={(num) => {
            
            pageNumberHandler(num);
          }}
        />
      </div>
      {/* add employees modal */}
      <AddEmployeesModal
        setIsModalDisplayed={setShowAddEmployeesModal}
        isModalDisplayed={showAddEmployeesModal}
        setChangesTracker={setChangesTracker}
      />

      {/* edit employee modal */}
      {showEditModal && (
        <EditEmployeeModal
          isModalDisplayed={showEditModal}
          setModalVisibility={setShowEditModal}
          reloadTrigger={setChangesTracker}
          employeeId={editEmployeeId}
        />
      )}

      {/* delete employee modal */}
      <DeleteEmployeeModal
        isModalDisplayed={showDeleteModal}
        setVisibility={setShowDeleteModal}
        data={deleteEmployeeData}
        reloadPageTrigger={setChangesTracker}
      />
    </>
  );
}
