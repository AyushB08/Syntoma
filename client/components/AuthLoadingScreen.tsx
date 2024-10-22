import { Montserrat } from "next/font/google";
import LogoIcon from "./LogoIcon";
const montserrat = Montserrat({ weight: "600", style: "normal", subsets: ["latin"] });

const AuthLoadingScreen = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-white z-100000">
      <div className="flex flex-row items-center space-x-2">
        <LogoIcon fill="#000000" width="75px" height="75px" />
        <h1 className={`${montserrat.className} tracking-tighter font-medium text-8xl text-blue-700`}>Syntoma</h1>
      </div>
      <div className="mt-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
