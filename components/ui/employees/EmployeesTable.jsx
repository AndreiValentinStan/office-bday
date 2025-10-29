"use client";

// table imports
import {
  createTheme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

// ui components
import FetchEmployeeLoadingScreen from "../loading screen/FetchEmployeeLoadingScreen";
import CellOptionsButton from "./CellOptionsButton";

// react imports
import { useState, useEffect } from "react";
import moment from "moment";

const tableStyle = createTheme({
  root: {
    base: "w-full text-left text-sm text-gray-500 dark:text-gray-400 border-separate border-spacing-0 rounded-lg border border-gray-200",
    shadow:
      "absolute left-0 top-0 -z-10 h-full w-full rounded-2xl bg-white drop-shadow-md dark:bg-black",
    wrapper: "relative",
  },
  body: {
    base: "group/body",
    cell: {
      base: "px-6 py-4 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg border-b-[1px] border-b-gray-200",
    },
  },
  head: {
    base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
    cell: {
      base: "bg-gray-50 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700",
    },
  },
  row: {
    base: "group/row",
    hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
    striped:
      "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700",
  },
});

export default function EmployeesTable({
  employees,
  loadingStatus,
  children,
  clickOutside,
  setClickOutside,
  visibleColumns: tableHeaders,
  currentPage,
  resultsPerPage,
}) {
  const titleStyle = "font-semibold text-md uppercase";
  //const tableHeaders = ["First Name", "Last Name", "Birth Date"];
  const [displayDropdown, setDisplayDropdown] = useState(null);
  useEffect(() => {
    if (clickOutside) {
      setDisplayDropdown(null);
      setClickOutside(false);
    }
  }, [clickOutside]);

  return (
    <>
      {loadingStatus ? (
        <FetchEmployeeLoadingScreen />
      ) : (
        <div
          onClick={(e) => {
            console.log({ displayDropdown, clickVal: e.target.value });
            if (e.target.id === "cell-options-button") {
              if (parseInt(e.target.value, 10) === displayDropdown)
                return setDisplayDropdown(null);
              return setDisplayDropdown(parseInt(e.target.value, 10));
            }
            return setDisplayDropdown(null);
          }}
        >
          {children}
          <Table theme={tableStyle}>
            <TableHead key={"table_header"}>
              <TableRow key={"header_row"}>
                <TableHeadCell key={"id"}></TableHeadCell>
                {tableHeaders.map(({ name, display }, index) => {
                  return (
                    display && <TableHeadCell key={index}>{name}</TableHeadCell>
                  );
                })}
                <TableHeadCell key="action"></TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody key={"table"}>
              {employees?.employees?.map((employee, index) => {
                return (
                  <TableRow key={employee.id}>
                    <TableCell className="max-w-2">
                      {currentPage * resultsPerPage + index + 1}
                    </TableCell>
                    {tableHeaders.map((column, index) => {
                      if (!column.display) return null;
                      if (column.alias === "date_of_birth")
                        return (
                          <TableCell key={index}>
                            {moment(employee.date_of_birth)
                              .format("DD MMMM YYYY")
                              .toString()}
                          </TableCell>
                        );
                      return (
                        <TableCell key={index}>
                          {employee[column.alias]}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <CellOptionsButton id={index} display={displayDropdown} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
