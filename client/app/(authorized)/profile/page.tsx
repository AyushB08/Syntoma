"use client";

import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

import { Montserrat } from "next/font/google";
import { Roboto } from 'next/font/google';
import { Poppins } from "next/font/google";
import { Red_Hat_Display } from "next/font/google";
import { Open_Sans } from "next/font/google";
import LogoIcon from "@/components/LogoIcon";
import Link from "next/link";


const roboto = Roboto({ weight: '100', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "500", style: "normal", subsets: ["latin"] });
const poppins = Poppins({ weight: "800", style: "normal", subsets: ["latin"] });
const redHatDisplay = Red_Hat_Display({ weight: '400', style: 'normal', subsets: ['latin'] });
const openSans = Open_Sans({ weight: '400', style: 'normal', subsets: ['latin'] });

const Profile = () => {
  const router = useRouter();
  const authContext = useAuth();

  const handleLogout = () => {
    authContext.logout();
    router.push("/");
  };

  return (
    <div className={`w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-800 to-blue-600`}>
      {authContext && authContext.user && (
        <div className="w-3/5 h-full flex flex-col items-center justify-center space-y-8">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-8xl text-center font-bold text-white">
              Welcome {" "}
              <span className="text-blue-400">{authContext.user.username}</span>
            </h1>
            <div className="flex flex-row items-center justify-center space-x-3">
              <h2 className="text-white text-2xl font-semibold">To </h2>
              <div className="flex items-center space-x-1">
                <LogoIcon fill="#4299e1" width="25px" height="25px" className=""/>
                <p className={`${montserrat.className} text-2xl text-white`}>Syntoma</p>
              </div>
            </div>
          </div>
          
          <h2 className={`${roboto.className} text-white text-xs mx-24 text-center`}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed eos deserunt explicabo, eum minus repudiandae enim excepturi totam. Labore ipsam tempora, suscipit ea sit placeat error dolores quia velit numquam! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe repudiandae eius hic cumque reprehenderit itaque illo dolores explicabo vero, et corporis magnam debitis at. Debitis inventore quaerat veritatis veniam quod!
          </h2>
          
          <div className="flex space-x-4 items-center justify-center">
            <Link href="/upload" className={`${montserrat.className} text-blue-600 px-12 py-2 bg-white rounded-full transition-colors duration-300 hover:bg-blue-600 hover:text-white`}>Upload</Link>
            <Link href="/about" className={`${montserrat.className} text-blue-600 px-8 py-2 bg-white rounded-full transition-colors duration-300 hover:bg-blue-600 hover:text-white`}>Learn More</Link>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
