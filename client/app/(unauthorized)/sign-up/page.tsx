"use client";
import SignUpForm from "@/components/SignUpForm";
import Image from "next/image";

const SignUp = () => {
    return ( 
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white">
            
            <SignUpForm/>
        </div>
    )
}

export default SignUp;