import Image from "next/image";
import Link from "next/link";

import { Montserrat } from "next/font/google";
import { Roboto } from 'next/font/google';
import { Poppins } from "next/font/google";
import { Red_Hat_Display } from "next/font/google";
import { Open_Sans } from "next/font/google";


const roboto = Roboto({ weight: '300', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "800", style: "normal", subsets: ["latin"] });
const poppins = Poppins({ weight: "800", style: "normal", subsets: ["latin"] });
const redHatDisplay = Red_Hat_Display({ weight: '600', style: 'normal', subsets: ['latin'] });
const openSans = Open_Sans({ weight: '400', style: 'normal', subsets: ['latin'] });



const ModelDescription = ({ src, text, link }) => {
  return (
    <div className="flex flex-row items-center bg-white w-3/5 text-black rounded-lg overflow-hidden shadow-lg ">
      <div className="w-24 h-full">
        <Image src={src} alt="model image" width={200} height={200} className="object-cover" />
      </div>
      <div className={`w-80 ${roboto.className} `}>
        <p className="px-4">{text}</p>
        <Link href={link}>
          <div className={`text-blue-500 underline ${redHatDisplay.className}`}>Upload</div>
        </Link>
      </div>
    </div>
  );
};

export default ModelDescription;
