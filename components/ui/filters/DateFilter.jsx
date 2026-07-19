"use client";

import { Dropdown, DropdownItem } from "flowbite-react";
import moment from "moment";

import { useEffect, useRef, useState } from "react";

const dropdownTheme = {
  arrowIcon: "ml-2 h-4 w-4",
  content: "py-1 focus:outline-none ",
  floating: {
    animation: "transition-opacity",
    arrow: {
      base: "absolute z-10 h-2 w-2 rotate-45",
      style: {
        dark: "bg-gray-900 dark:bg-gray-700",
        light: "bg-white",
        auto: "bg-white dark:bg-gray-700",
      },
      placement: "-4px",
    },
    base: "z-10 w-fit divide-y divide-gray-100 rounded shadow focus:outline-none max-h-48 overflow-y-auto",
    content: "py-1 text-sm text-gray-700 dark:text-gray-200 max-h-48",
    divider: "my-1 h-px bg-gray-100 dark:bg-gray-600",
    header: "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200",
    hidden: "invisible opacity-0",
    item: {
      container: "",
      base: "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
      icon: "mr-2 h-4 w-4",
    },
    style: {
      dark: "bg-gray-900 text-white dark:bg-gray-700",
      light: "border border-gray-200 bg-white text-gray-900",
      auto: "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white",
    },
    target:
      "w-fit text-slate-500 focus:outline-nones focus:ring-0 bg-white rounded-none h-8",
  },
  inlineWrapper: "flex items-center text-black",
};

export default function DateFilter({ setFieldValue, fieldValue, searchParam }) {
  function handleDateChange({ unit, amount }) {
    setFieldValue(searchParam, {
      ...fieldValue,
      [unit]: amount,
    });
  }
  console.log(fieldValue, fieldValue?.month || fieldValue?.month !== '' );

  return (
    <div className="relative flex border border-blue-400 rounded-sm text-black bg-gray-100 focus-within:outline-blue-500 focus-within:outline-1 focus-within:outline">
      <Dropdown
        label={fieldValue?.day || "Zi"}
        theme={{
          ...dropdownTheme,
          floating: {
            ...dropdownTheme.floating,
            target:
              "w-fit text-slate-500 focus:outline-nones focus:ring-0 bg-white rounded-r-none h-8 rounded-l-sm",
          },
        }}
      >
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day, index) => (
          <DropdownItem
            key={index}
            onClick={() => handleDateChange({ unit: "day", amount: day })}
          >
            {day}
          </DropdownItem>
        ))}
      </Dropdown>
      <Dropdown

        label={
          fieldValue?.month ? moment().month(fieldValue.month - 1).locale('ro').format("MMMM") : "Luna"
        }
        theme={dropdownTheme}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month, index) => (
          <DropdownItem
            onClick={() => {
              handleDateChange({ unit: "month", amount: month });
            }}
            key={index}
          >
            {moment().month(month - 1).locale('ro').format("MMMM")}
          </DropdownItem>
        ))}
      </Dropdown>
      <Dropdown
        label={fieldValue?.year || "An"}
        theme={{
          ...dropdownTheme,
          floating: {
            ...dropdownTheme.floating,
            target:
              "w-fit text-slate-500 focus:outline-nones focus:ring-0 bg-white rounded-l-none rounded-r-sm h-8 ",
          },
        }}
      >
        {Array.from({ length: 60 }, (_, i) => i).map((index) => (
          <DropdownItem
            onClick={() =>
              handleDateChange({
                unit: "year",
                amount: new Date(Date.now()).getFullYear() - index,
              })
            }
            key={index}
          >
            {new Date(Date.now()).getFullYear() - index}
          </DropdownItem>
        ))}
      </Dropdown>
      <span
        id="filter-label"
        className="absolute left-2 -top-2 text-xs text-blue-500 bg-white px-1 rounded-sm font-medium"
      >
        Birth Date
      </span>
    </div>
  );
}
