"use client";
import SignUpForm from "@/components/SignUpForm";
import Image from "next/image";

const SignUp = () => {
    return ( 
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 to-blue-600">
            
            <SignUpForm/>
        </div>
    )
}

export default SignUp;