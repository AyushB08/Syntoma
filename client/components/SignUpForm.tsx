import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import Link from "next/link";
import LogoIcon from "./LogoIcon";

import { Montserrat } from "next/font/google";
import { Roboto } from 'next/font/google';
import { Poppins } from "next/font/google";


const roboto = Roboto({ weight: '400', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "300", style: "normal", subsets: ["latin"] });
const poppins = Poppins({ weight: "200", style: "normal", subsets: ["latin"] });


export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const authContext = useAuth();

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const body = { username, email, password };
      const response = await fetch("http://localhost:8000/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Sign-up successful:", data);
        if (authContext) {
          authContext.login({ email, username });
        }
        router.push("/profile");
      } else {
        console.error("Sign-up failed:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <form className="w-1/2 h-auto rounded-lg bg-white p-6 shadow-lg" onSubmit={onSubmitForm}>
      <div className="flex flex-row items-center justify-center space-x-1">
          <LogoIcon fill="#000000" width="30px" height="30px" className=""/>
          <Link href="/" className={`${montserrat.className} tracking-tighter text-4xl text-blue-700 `}>Syntoma</Link>

        </div>
      <div className="mb-4">
        <label htmlFor="email" className="text-black text-sm font-semibold mb-1">Email Address</label>
        <input onChange={e => setEmail(e.target.value)} value={email} type="email" id="email" className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" placeholder="Enter your email" />
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="text-black text-sm font-semibold mb-1">Username</label>
        <input onChange={e => setUsername(e.target.value)} value={username} type="text" id="username" className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" placeholder="Enter your username" />
      </div>
      <div className="mb-6 text-black">
        <label htmlFor="password" className="text-black text-sm font-semibold mb-1">Password</label>
        <input onChange={e => setPassword(e.target.value)} value={password} type="password" id="password" className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" placeholder="Enter your password" />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
        {loading ? <div className="flex justify-center items-center"><div className="loader"></div>Loading...</div> : "Sign Up"}
      </button>
      <Link href="/sign-in" className="mt-4 text-blue-600 hover:text-black flex  items-center">Sign In &rarr;</Link>
    </form>
  );
}
