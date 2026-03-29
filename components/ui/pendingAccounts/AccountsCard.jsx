import AccountsList from "./AccountsList";
import PaginationController from "../pagination/PaginationController";
import PageCountController from "./PageCountController";

export default async function AccountsCard({
  accountsArray,
  totalCount,
  limit = 10,
  page = 1,
}) {
  return (
    <>
      {/* results per page */}
      <PageCountController />
      {/* pending accounts list */}
      <section className="h-full overflow-auto">
        <AccountsList accountsArray={accountsArray} />
      </section>
      {/* pagination */}
      <section className="">
        <PaginationController
          resultsPerPage={limit}
          totalCount={Math.ceil(totalCount / limit)}
          currentPage={page}
        />
      </section>
    </>
  );
}
