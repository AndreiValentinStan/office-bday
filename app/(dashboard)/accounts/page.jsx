import { Suspense } from "react";
import AccountsCard from "../../../components/ui/pendingAccounts/AccountsCard";
import Loading from "../../../components/ui/pendingAccounts/loading";

const cardsStyle = "bg-gray-50 p-3 rounded-sm flex flex-col w-full";

export default async function Accounts({searchParams}) {
  const {page=1, limit=10} = await searchParams || {}
  console.log({page, limit});
  return (
    <div className="w-full h-full flex flex-col items-center p-5 gap-y-5 overflow-hidden">
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
        className={cardsStyle + " flex-1 overflow-hidden flex flex-col gap-y-5 justify-between"}
      >
        <Suspense key={`${page}-${limit}`} fallback={<Loading/>}>
          <AccountsCard page={page} limit={limit}/>
        </Suspense>
      </section>
    </div>
  );
}
