"use client";

import SignInForm from "@/components/SignInForm";


const SignIn = () => {
    return ( 
        <div className="w-screen h-screen flex flex-col items-center justify-center  bg-gradient-to-r from-blue-900 to-blue-600">
            
            <SignInForm/>
        </div>
    );
};

export default SignIn;