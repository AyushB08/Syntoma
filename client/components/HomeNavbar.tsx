"use client";
import Link from "next/link";
import "./navbarstyles.css";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";


import LogoIcon from "./LogoIcon";

import { Montserrat } from "next/font/google";
import { Roboto } from 'next/font/google';
import { Poppins } from "next/font/google";
import { Red_Hat_Display } from "next/font/google";
import { Open_Sans } from "next/font/google";


const roboto = Roboto({ weight: '500', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "500", style: "normal", subsets: ["latin"] });
const poppins = Poppins({ weight: "800", style: "normal", subsets: ["latin"] });
const redHatDisplay = Red_Hat_Display({ weight: '400', style: 'normal', subsets: ['latin'] });
const openSans = Open_Sans({ weight: '400', style: 'normal', subsets: ['latin'] });


const HomeNavbar = () => {
  const links = [
    { href: "/sign-in", label: "Sign In" },
    { href: "/sign-up", label: "Sign Up" },
    
    
  ];
  const router = useRouter();
  const authContext = useAuth();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="absolute top-0 left-0 navbar bg-gray-200">
      <div className="flex-1 space-x-2">
        <div className="flex btn btn-ghost">
          <LogoIcon fill="#000000" width="25px" height="25px" className=""/>
          <Link href="/" className={`${montserrat.className} tracking-tighter text-xl text-blue-700 `}>Syntoma</Link>
          
        </div>
        <p className={` text-sm bg-blue-600 text-white rounded-lg px-2 ${roboto.className}`}>BETA</p>
        
       
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 text-white">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={`text-blue-700 ${roboto.className} hidden md:flex`}>{link.label}</Link>
            </li>
            
          ))}
          
          <li className={`${montserrat.className} md:hidden`}>
              <details>
                <summary className={`text-blue-700 ${roboto.className} `}>Links</summary>
                <ul className="bg-base-100 rounded-t-none p-2 {`text-blue-700 ${roboto.className} `}">
                  {links.map((link) => (
                    <li key={`details-${link.href}`}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                  
                </ul>
            </details>

          </li>
        </ul>
      </div>
    </div>
    /*
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
    */
  );
};

export default HomeNavbar;
