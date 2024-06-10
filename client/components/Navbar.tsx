"use client";
import Link from "next/link";
import "./navbarstyles.css";
import {useRouter} from "next/navigation";
import { useAuth } from "@/contexts/authContext";

const Navbar = () => {
  const links = [
    { href: "/profile", label: "Profile" },
    { href: "/upload", label: "Upload" },
    { href: "/images", label: "Images"},
  ];
  const router = useRouter();
  const authContext = useAuth();

  const handleLogout = () => {
    authContext.logout();
    router.push("/");
  };


  return (
    <nav className="absolute top-0 left-0 w-full text-white flex flex-row  justify-center text-sm items-center">
      <div className="container flex justify-between items-center p-4">


        <div className="flex items-center">
          <Link href="/">Vital</Link>
        </div>
        <ul className="flex justify-center">

          {links.map((link) => (

            <li key={link.href} className="link text-sm mx-5">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <div className="link flex items-center">
          <button  onClick={handleLogout}>Sign Out</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
