"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function PageCountController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let limit = searchParams.get("limit") || 10;
  const page = searchParams.get("page") || 1;

  console.log({ pageNUm: page });

  function changeResultsPerPageHandler(newValue) {
    router.replace(`/accounts?page=${page}&limit=${newValue}`);
  }

  return (
    <section>
      <select
        value={limit}
        onChange={(e) => changeResultsPerPageHandler(e.target.value)}
        className="border-none cursor-pointer"
      >
        <option>10</option>
        <option>50</option>
        <option>100</option>
      </select>
    </section>
  );
}
