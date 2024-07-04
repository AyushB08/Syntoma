"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import LogoIcon from "./LogoIcon";
import { Roboto } from 'next/font/google';
import { Montserrat } from "next/font/google";

const roboto = Roboto({ weight: '500', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "500", style: "normal", subsets: ["latin"] });

const HomeNavbar = () => {
  const links = [
    { href: "/profile", label: "Profile" },
    { href: "/upload", label: "Upload" },
    { href: "/scans", label: "Scans" },
    { href: "/clinics", label: "Clinics" },
    { href: "/", label: "Sign Out" }, // New "Sign Out" link
  ];

  const router = useRouter();
  const authContext = useAuth();

  const handleLogout = () => {
    authContext.logout(); // You may need to adjust this based on your authContext implementation
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
              {link.label === "Sign Out" ? (
                <button onClick={handleLogout} className={`text-blue-700 ${roboto.className} hidden md:flex`}>{link.label}</button>
              ) : (
                <Link href={link.href} className={`text-blue-700 ${roboto.className} hidden md:flex`}>{link.label}</Link>
              )}
            </li>
          ))}
          <li className={`${montserrat.className} md:hidden`}>
            <details>
              <summary className={`text-blue-700 ${roboto.className} `}>Links</summary>
              <ul className="bg-base-100 rounded-t-none p-2 {`text-blue-700 ${roboto.className} `}">
                {links.map((link) => (
                  <li key={`details-${link.href}`}>
                    {link.label === "Sign Out" ? (
                      <button onClick={handleLogout}>{link.label}</button>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomeNavbar;
