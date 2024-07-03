import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXRay, faTooth, faLungs, faBone } from '@fortawesome/free-solid-svg-icons';

import HomeNavbar from '@/components/HomeNavbar';
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Roboto } from 'next/font/google';
import Link from 'next/link';

const roboto = Roboto({ weight: '500', style: 'normal', subsets: ['latin'] });

const Home = () => {
  return (
    <>
      <HomeNavbar />
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 to-blue-600">
        <div className="w-4/5 h-2/3 items-center justify-center flex flex-row ">
          <div className="w-3/5 h-full justify-center flex flex-col">
            <h1 className="text-white text-6xl ml-20 pb-2">Revolutionize Healthcare with Instant Results to Medical Scans</h1>
            <h1 className="text-white ml-20 text-xl pb-8">Obtain a second opinion within seconds</h1>
            <div className="flex flex-row space-x-4">
              <Link href="/sign-in" className={`${roboto.className} text-xl flex items-center justify-center px-10 py-4 ml-20 bg-white text-blue-600 rounded-full w-1/4 transition-colors duration-300 hover:bg-blue-600 hover:text-white`}><p>Sign In</p></Link>
              <Link href="/sign-up" className={`${roboto.className} text-xl flex items-center justify-center px-10 py-4 ml-20 bg-white text-blue-600 rounded-full w-1/4 transition-colors duration-300 hover:bg-blue-600 hover:text-white`}><p>Sign Up</p></Link>
            </div>
          </div>
          <div className="w-2/5 h-full items-center justify-center flex flex-col">
            <Image src="/images/report.png" height={600} width={600} alt="report" className="ml-16"/>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 flex flex-row w-full h-1/5 items-center justify-center text-white">
        <div className="w-3/5 flex flex-row justify-around items-center text-white">
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faXRay} size="3x" />
            <p className="text-sm">Knee</p>
          </div>
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faLungs} size="3x" />
            <p className="text-sm">Chest</p>
          </div>
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faTooth} size="3x" />
            <p className="text-sm">Dental</p>
          </div>
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faBone} size="3x" />
            <p className="text-sm">Spine</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
