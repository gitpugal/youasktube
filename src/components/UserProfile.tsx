import { Session } from "next-auth";
import Image from "next/image";
import React from "react";

const UserProfile = ({ session }: { session: Session | null }) => {
  if (!session) return null;

  return (
    <div className="cursor-pointer group hover:shadow-2xl z-50 flex items-center gap-3 px-1  pr-3 py-1 bg-white/10 backdrop-blur-md border shadow-lg rounded-full text-sm ">
      {session.user?.image && (
        <Image
          alt="User Profile"
          src={session.user.image}
          width={36}
          height={36}
          className="rounded-full group-hover:rotate-x-360 cursor-pointer duration-700 transition-all ease-in-out"
        />
      )}
      <p className="font-light">{session.user?.name}</p>
    </div>
  );
};

export default UserProfile;
