import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import Link from "next/link";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import { Montserrat } from "next/font/google";
import { Roboto } from 'next/font/google';
import { Poppins } from "next/font/google";
import LogoIcon from "./LogoIcon";
import AuthLoadingScreen from "./AuthLoadingScreen";

const roboto = Roboto({ weight: '400', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "500", style: "normal", subsets: ["latin"] });
const poppins = Poppins({ weight: "200", style: "normal", subsets: ["latin"] });

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 
  const router = useRouter();
  const authContext = useAuth();

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body = { email, password };
      const response = await fetch("http://localhost:8000/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("USER: " + data.username);
        if (authContext) {
          console.log(data);
          authContext.login({ email, username: data.username });
        }
        router.push("/profile");
      } else {
        console.error("Sign-in failed:", data.error);
        setShowPopup(true); // Show the popup for invalid credentials
        setTimeout(() => setShowPopup(false), 2000); // Hide the popup after 2 seconds
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return ( 
      <AuthLoadingScreen/>
    )
  }

  return (
    <>
      <style jsx global>{`
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px white inset;
          -webkit-text-fill-color: black;
        }

        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px white inset;
          -webkit-text-fill-color: black;
        }

        input:-webkit-autofill:hover {
          -webkit-box-shadow: 0 0 0 1000px white inset;
          -webkit-text-fill-color: black;
        }

        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px white inset;
          -webkit-text-fill-color: black;
        }
      `}</style>
      <form className="w-1/2 h-auto rounded-lg bg-white p-6 shadow-lg" onSubmit={onSubmitForm}>
        <div className="flex flex-row items-center justify-center space-x-1">
          <LogoIcon fill="#000000" width="30px" height="30px" className=""/>
          <Link href="/" className={`${montserrat.className} tracking-tighter text-4xl text-blue-700 `}>Syntoma</Link>
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="text-black text-sm font-semibold mb-1">Email Address</label>
          <input onChange={e => setEmail(e.target.value)} value={email} type="email" id="email" className="text-black bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" placeholder="Enter your email" />
        </div>
        <div className="mb-6 text-black">
          <label htmlFor="password" className="text-black text-sm font-semibold mb-1">Password</label>
          <input onChange={e => setPassword(e.target.value)} value={password} type="password" id="password" className="bg-white text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" placeholder="Enter your password" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
          {loading ? <div className="flex justify-center items-center"><div className="loader"></div>Loading...</div> : "Sign In"}
        </button>
        <Link href="/sign-up" className="mt-4 text-blue-600 hover:text-black flex items-center">Sign Up &rarr;</Link>
      </form>

      {/* Popup for displaying "Invalid credentials" */}
      {showPopup && (
        <Popup open={showPopup} closeOnDocumentClick onClose={() => setShowPopup(false)}>
          <div className={`${montserrat.className} py-6  bg-red-700 text-white text-4xl rounded-lg text-center`}>Invalid credentials</div>
        </Popup>
      )}
    </>
  );
}
