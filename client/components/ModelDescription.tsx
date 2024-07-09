import Image from "next/image";
import Link from "next/link";

import { Montserrat } from "next/font/google";
import { Roboto } from 'next/font/google';
import { Poppins } from "next/font/google";
import { Red_Hat_Display } from "next/font/google";
import { Open_Sans } from "next/font/google";


const roboto = Roboto({ weight: '500', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "800", style: "normal", subsets: ["latin"] });
const poppins = Poppins({ weight: "800", style: "normal", subsets: ["latin"] });
const redHatDisplay = Red_Hat_Display({ weight: '600', style: 'normal', subsets: ['latin'] });
const openSans = Open_Sans({ weight: '400', style: 'normal', subsets: ['latin'] });


const ModelDescription = ({ src, text, link }) => {
  return (
    <Link href={link} className="flex flex-col items-center bg-white w-44 text-black rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-gray-200">
      <div className="w-full">
        <Image src={src} alt="model image" width={400} height={400} layout="responsive" />
      </div>
      <div className={`w-full py-2 ${redHatDisplay.className} text-center`}>
        <p className="px-4">{text}</p>
      </div>
    </Link>
  );
};

export default ModelDescription;
