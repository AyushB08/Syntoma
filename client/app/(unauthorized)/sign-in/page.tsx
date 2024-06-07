"use client";

import SignInForm from "@/components/SignInForm";


const SignIn = () => {
    return ( 
        <div className="w-screen h-screen flex flex-col items-center justify-center  bg-gradient-to-b from-blue-100 to-white">
            
            <SignInForm/>
        </div>
    );
};

export default SignIn;