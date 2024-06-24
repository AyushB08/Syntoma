"use client";
import Link from "next/link";
import "./navbarstyles.css";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

import { Montserrat } from "next/font/google";
import { Roboto } from 'next/font/google';
import { Poppins } from "next/font/google";
import LogoIcon from "./LogoIcon";

const roboto = Roboto({ weight: '400', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "300", style: "normal", subsets: ["latin"] });
const poppins = Poppins({ weight: "200", style: "normal", subsets: ["latin"] });

const Navbar = () => {
  const links = [
    { href: "/profile", label: "Profile" },
    { href: "/upload", label: "Upload" },
    { href: "/scans", label: "Scans" },
    { href: "/clinics", label: "Clinics" },
  ];
  const router = useRouter();
  const authContext = useAuth();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <nav className="absolute top-0 left-0 w-full text-white flex flex-row justify-center text-sm items-center">
      <div className="container flex justify-between items-center p-4">
        <div className="flex items-center">
          <div className="flex items-center justify-center link py-2 px-3 rounded-lg"> 
            <LogoIcon fill="#fff" width="25px" height="25px" className="mr-2"/>
            <Link href="/" className={`${montserrat.className} tracking-tighter text-xl text-blue-300 `}>Syntoma</Link>
          </div>
          
          <p className={` mx-4 text-sm bg-gray-400 rounded-lg px-2 ${montserrat.className}`}>BETA</p>
        </div>
        <div className="flex items-center">
          <ul className="flex justify-center">
            {links.map((link) => (
              <li key={link.href} className={` rounded-lg link text-sm mx-2 py-2 px-3 ${montserrat.className}`}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <div className={`link flex items-center  rounded-lg  mx-2 py-2 px-3 ${montserrat.className}`}>
            <button onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
