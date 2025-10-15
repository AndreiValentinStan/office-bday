import AccountsCard from "../../../components/ui/pendingAccounts/AccountsCard";
import User from "../../../models/user";

async function fetchPendingAccounts() {
  let pendingAccounts = [];
  try {
    pendingAccounts = await User.findAndCountAll({
      where: {
        status: "PENDING",
      },
      attributes: ["first_name", "last_name", "email", "status"],
    });
  } catch (err) {
    console.log(err);
  } finally {
    return pendingAccounts;
  }
}

const cardsStyle = "bg-gray-50 p-3 rounded-sm flex flex-col w-full";

export default async function Accounts({ searchParams }) {
  const res = await searchParams;
  const { count, rows: accounts } = (await fetchPendingAccounts()) || {};
  return (
    <div className="w-full h-dvh flex flex-col items-center p-5 gap-y-5 overflow-hidden">
      {/* title */}
      <section className={cardsStyle}>
        <span className="text-2xl">Pending Accounts</span>
        <span className="italic text-xs">
          In this view are showed accounts that need to be confirmed before they
          can be used.
        </span>
      </section>
      {/* content */}
      <section
        className={cardsStyle + " flex-1 overflow-hidden flex flex-col gap-y-5"}
      >
        {accounts?.length === 0 ? (
          <div className="flex flex-col gap-y-5 items-center">
            <img src="/gifs/tasks_done.gif" className="max-w-96"></img>
            <span className="text-gray-700">
              Great job! There are no new accounts that require confirmation.
            </span>
          </div>
        ) : (
          <AccountsCard accountsArray={accounts} />
        )}
      </section>
    </div>
  );
}
