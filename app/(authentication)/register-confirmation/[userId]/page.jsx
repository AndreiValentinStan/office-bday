import { notFound, redirect } from "next/navigation";
import User from "../../../../models/user";

export default async function RegisterConfirmation({ params }) {
  const { userId: id } = await params;
  const user = await User.findOne({
    where: {
      id,
    },
    attributes: {
      include: ["first_name", "last_name"],
    },
  });

  if (true) {
    redirect('/not-found')
  }

  const { first_name, last_name } = user;

  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center justify-center bg-blue-50 p-5 rounded-md">
        <h1 className="text-2xl mb-2">
          Welcome, {last_name} {first_name}!
        </h1>
        <span>
          You're account has been created, but before you can login in, it have
          to be confirmed by an admin!
        </span>
        <span>
          You`ll recieve an email after you're account will be activated.
        </span>
        <span>Stay close!</span>
      </div>
    </div>
  );
}
