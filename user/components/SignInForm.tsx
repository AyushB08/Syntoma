// src/components/SignInForm.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const authContext = useAuth();

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="w-1/2 h-auto rounded-lg bg-white p-6 shadow-lg" onSubmit={onSubmitForm}>
      <h1 className="flex flex-row text-4xl mb-4 justify-center items-center text-black ">Company</h1>
      <div className="mb-4">
        <label htmlFor="email" className="text-black text-sm font-semibold mb-1">Email Address</label>
        <input onChange={e => setEmail(e.target.value)} value={email} type="email" id="email" className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-700" placeholder="Enter your email" />
      </div>
      <div className="mb-6 text-black">
        <label htmlFor="password" className="text-black text-sm font-semibold mb-1">Password</label>
        <input onChange={e => setPassword(e.target.value)} value={password} type="password" id="password" className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-700" placeholder="Enter your password" />
      </div>
      <button type="submit" className="w-full bg-red-700 text-white py-2 rounded-lg hover:bg-red-900 focus:outline-none">Sign In</button>
    </form>
  );
}
