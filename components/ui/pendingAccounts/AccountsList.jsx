"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useState } from "react";
import ApiInterface from "../../../utils/ApiInterface";
import { useRouter } from "next/navigation";

const { patch } = ApiInterface;

export default function AccountsList({ accountsArray }) {
  const router = useRouter();
  const [accountsIds, setAccountsIds] = useState({});

  function selectAllHandler({ target }) {
    if (target.checked)
      return setAccountsIds((_) => {
        return accountsArray.reduce((allAcounts, currentAccount) => {
          return {
            ...allAcounts,
            [currentAccount.id]: true,
          };
        }, {});
      });
    return setAccountsIds((_) => ({}));
  }

  function checkHandler(value, id) {
    if (value) return setAccountsIds((prev) => ({ ...prev, [id]: true }));
    return setAccountsIds((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return { ...copy };
    });
  }

  async function handleConfirmSelected() {
    try {
      await patch("/user/confirm-account", {
        accounts: Object.keys(accountsIds),
      });
      setAccountsIds({});
    } catch (err) {
    } finally {
      router.replace("/accounts?page=1&limit=10");
    }
  }

  return (
    <>
      <section className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 scrollbar-corner-transparent">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>
                <input
                  className="hover:cursor-pointer"
                  type="checkbox"
                  onChange={selectAllHandler}
                ></input>
              </TableHeadCell>
              <TableHeadCell>First Name</TableHeadCell>
              <TableHeadCell>Last Name</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Account Status</TableHeadCell>
              <TableHeadCell></TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountsArray?.map(
              ({ id, first_name, last_name, email, status }, index) => {
                return (
                  <TableRow key={index} className="border-b last:border-b-0">
                    <TableCell>
                      <input
                        className="hover:cursor-pointer"
                        type="checkbox"
                        checked={accountsIds[id] ?? false}
                        onChange={({ target }) =>
                          checkHandler(target.checked, id)
                        }
                      ></input>
                    </TableCell>
                    <TableCell>{first_name}</TableCell>
                    <TableCell>{last_name}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>
                      <span className="bg-yellow-200 px-4 py-2 text-yellow-500 rounded-sm">
                        {status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      </section>

      <div className="flex justify-center">
        <button
          onClick={handleConfirmSelected}
          disabled={!Object.keys(accountsIds).length}
          className="bg-blue-600 rounded-md disabled:bg-blue-300 py-2 px-4 text-white hover:bg-blue-600/90"
        >
          Confirm selected
        </button>
      </div>
    </>
  );
}
