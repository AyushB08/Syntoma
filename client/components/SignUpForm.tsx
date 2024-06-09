import {useState } from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/contexts/authContext";
import Link from "next/link";

export default function SignUpForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const router = useRouter();
    const authContext = useAuth();

    const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      const body = {username,  email, password };
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
        console.error("Sign-in failed:", data.error);
      }
    }

    return (
      <form className="w-1/2 h-auto rounded-lg bg-white p-6 shadow-lg" onSubmit={onSubmitForm}>
        <h1 className="text-blue-700 font-bold flex flex-row text-4xl mb-4 justify-center items-center ">Vital</h1>
        <div className="mb-4">
          <label htmlFor="email" className="text-black text-sm font-semibold mb-1">Email Address</label>
          <input onChange={e => setEmail(e.target.value)} value={email} type="email" id="email" className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" placeholder="Enter your email" />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="text-black text-sm font-semibold mb-1">Username</label>
          <input onChange={e => setUsername(e.target.value)} value={username} type="text" id="username" className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" placeholder="Enter your email" />
        </div>
        <div className="mb-6 text-black">
          <label htmlFor="password" className="text-black text-sm font-semibold mb-1">Password</label>
          <input onChange={e => setPassword(e.target.value)} value={password} type="password" id="password" className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" placeholder="Enter your password" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none">Sign Up</button>
        <Link href="/sign-in" className="mt-4 text-blue-600 hover:text-black flex  items-center">Sign In &rarr;</Link>
      </form>
    );
  }
  