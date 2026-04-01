import { Spinner } from "flowbite-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 w-full h-full">
      <Spinner className="fill-blue-500 h-12 w-12"></Spinner>
      <span className="text-lg text-gray-400">Loading...</span>
    </div>
  );
}
