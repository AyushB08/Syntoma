import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import Link from "next/link";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
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
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <form className="w-1/2 h-auto rounded-lg bg-white p-6 shadow-lg " onSubmit={onSubmitForm}>
      <h1 className="text-blue-700 font-bold flex flex-row text-4xl mb-4 justify-center items-center  ">Vital</h1>
      <div className="mb-4">
        <label htmlFor="email" className="text-black text-sm font-semibold mb-1">Email Address</label>
        <input onChange={e => setEmail(e.target.value)} value={email} type="email" id="email" className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" placeholder="Enter your email" />
      </div>
      <div className="mb-6 text-black">
        <label htmlFor="password" className="text-black text-sm font-semibold mb-1">Password</label>
        <input onChange={e => setPassword(e.target.value)} value={password} type="password" id="password" className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" placeholder="Enter your password" />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
        {loading ? <div className="flex justify-center items-center"><div className="loader"></div>Loading...</div> : "Sign In"}
      </button>
      <Link href="/sign-up" className="mt-4 text-blue-600 hover:text-black flex  items-center">Sign Up &rarr;</Link>
    </form>
  );
}
