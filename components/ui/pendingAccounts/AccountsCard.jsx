import { Pagination } from "flowbite-react";
import AccountsList from "./AccountsList";
import PaginationController from "../pagination/PaginationController";

export default async function AccountsCard({ accountsArray, searchParams }) {
    console.log(accountsArray, searchParams);
  return (
    <>
      {/* results per page */}
      <section >
        <select className="border-none cursor-pointer">
          <option>10</option>
          <option>50</option>
          <option>100</option>
        </select>
      </section>
      {/* pending accounts list */}
      <section className="h-full overflow-auto">
        <AccountsList accountsArray={accountsArray} />
      </section>
      {/* pagination */}
      <section className="bg-red-200">
        <PaginationController resultsPerPage={10} totalCount={accountsArray.length} currentPage={1}/>
      </section>
    </>
  );
}
