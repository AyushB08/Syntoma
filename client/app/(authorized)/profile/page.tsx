"use client";

import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const authContext = useAuth();

  const handleLogout = () => {
    authContext.logout();
    router.push("/");
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
      {authContext && authContext.user && (
        <div className="w-3/5 h-full flex flex-col items-center justify-center">
          <h1 className="text-8xl text-center mb-10 text-white">
            Welcome to your profile,{" "}
            <span className="text-blue-500">{authContext.user.username}</span>.
          </h1>
          
          <button
            onClick={handleLogout}
            className="text-white px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
