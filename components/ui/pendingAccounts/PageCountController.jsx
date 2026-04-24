"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function PageCountController({}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  let limit = searchParams.get("limit") || 10;

  function changeResultsPerPageHandler(newValue) {
    router.replace(`/accounts?page=${1}&limit=${newValue}`);
  }

  return (
    <section>
      <select
        value={limit}
        onChange={(e) => changeResultsPerPageHandler(e.target.value)}
        className="border-none cursor-pointer"
      >
        <option>10</option>
        <option>20</option>
        <option>50</option>
      </select>
    </section>
  );
}
