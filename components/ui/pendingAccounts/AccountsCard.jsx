import AccountsList from "./AccountsList";
import PaginationController from "../pagination/PaginationController";
import PageCountController from "./PageCountController";
import User from "../../../models/user";

async function fetchPendingAccounts(page = 1, limit = 10) {
  let pendingAccounts = [];
  let count = 0;
  /* await new Promise((res) => {
    setTimeout(() => {
      return res("ok");
    }, 3000);
  }); */
  try {
    const data = await User.findAndCountAll({
      where: {
        status: "PENDING",
      },
      attributes: ["id", "first_name", "last_name", "email", "status"],
      offset: (parseInt(page) - 1) * limit,
      limit: parseInt(limit),
    });
    pendingAccounts = data.rows;
    count = data.count;
  } catch (err) {
    console.log(err);
  } finally {
    return {
      count,
      rows: JSON.parse(JSON.stringify(pendingAccounts)),
    };
  }
}

export default async function AccountsCard({ page = 1, limit = 10 }) {
  const { count: totalCount, rows: accountsArray } =
    (await fetchPendingAccounts(page, limit)) || {};
  console.log({pageNUmber: page});
  return (
    <>
      {accountsArray?.length === 0 ? (
        <>
          <div className="flex flex-col gap-y-5 items-center justify-center w-full h-full">
            <img src="/gifs/tasks_done.gif" className="max-w-96"></img>
            <span className="text-gray-700">
              Great job! There are no new accounts that require confirmation.
            </span>
          </div>
        </>
      ) : (
        <>
          {/* results per page */}
          <PageCountController />

          {/* pending accounts list */}
          <AccountsList accountsArray={accountsArray} />

          {/* pagination */}
          <section className="">
            <PaginationController
              resultsPerPage={limit}
              totalCount={Math.ceil(totalCount / limit)}
              currentPage={parseInt(page)}
              limit={limit}
            />
          </section>
        </>
      )}
    </>
  );
}
