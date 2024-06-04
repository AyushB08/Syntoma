"use client";


import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const authContext = useAuth();

 
  if (!authContext || !authContext.user) {
    router.push("/");
    return null; 
  }

  const handleLogout = () => {
    authContext.logout();
    router.push("/");
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-3/5 h-full flex flex-col items-center justify-center">
        <h1 className="text-8xl text-center mb-10">
          Welcome to your profile,{" "}
          <span className="text-red-700">{authContext.user.username}</span>.
        </h1>
        
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-700 rounded-lg hover:bg-red-900"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
