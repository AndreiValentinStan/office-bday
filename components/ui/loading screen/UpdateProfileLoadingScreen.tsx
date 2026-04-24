import { Spinner } from "flowbite-react";

export default function FetchEmployeeLoadingScreen() {
  return (
    <>
      <div className="w-full h-full absolute top-0 left-0 bg-white opacity-80 z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-y-3">
        <Spinner />
        <h1 className=" left-1/2 top-1/2 text-blue-500 select-none text-xl">
            Saving changes...
        </h1>
      </div>
    </>
  );
}
