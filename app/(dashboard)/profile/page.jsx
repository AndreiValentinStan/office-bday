import ProfileForm from "../../../components/ui/profile/Form";

const cardsStyle = "bg-gray-50 p-3 rounded-sm flex flex-col w-full";

function fetchUserData() {

}

export default function Profile({}) {
  return (
    <div className="w-full h-dvh flex flex-col items-center p-5 gap-y-5 overflow-hidden">
      {/* title */}
      <section className={cardsStyle}>
        <span className="text-2xl">Edit profile</span>
        <span className="italic text-xs">
          You can edit your personal information or your password
        </span>
      </section>

      {/* personal information form */}
      <section className={`${cardsStyle} `}>
        <ProfileForm />
      </section>
    </div>
  );
}
