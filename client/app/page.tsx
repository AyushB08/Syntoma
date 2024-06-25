import Link from 'next/link';
import { Montserrat } from "next/font/google";
import { Roboto } from 'next/font/google';
import { Poppins } from "next/font/google";


const roboto = Roboto({ weight: '400', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "300", style: "normal", subsets: ["latin"] });
const poppins = Poppins({ weight: "200", style: "normal", subsets: ["latin"] });

const Home = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-6xl text-black mb-5 font-bold">Welcome to <span className={`text-blue-700 tracking-tighter ${montserrat.className}`}>Syntoma</span> </h1>
      <h3 className="text-2xl text-black">Revolutionizing Healthcare with Instant Results to your Medical Scans</h3>
      <div className="links flex flex-row mt-5 space-x-4">
        <Link href="/sign-in">
          <p className="text-white bg-blue-600 py-2 px-3  text-sm">Sign In</p>
        </Link>
        <Link href="/sign-up">
          <p className="text-white bg-blue-600 py-2 px-3 text-sm">Sign Up</p>
        </Link>
        <Link href="/demo">
          <p className="text-white bg-blue-600 py-2 px-3  text-sm">Demo &rarr;</p>
        </Link>
      </div>
      
    </div>
  );
};

export default Home;
