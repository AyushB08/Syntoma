"use client";

import { useState } from 'react';
import Link from "next/link";
import { useAuth } from "@/contexts/authContext";
import {useRouter } from "next/navigation";

import { Montserrat } from "next/font/google";
import { Roboto } from 'next/font/google';
import { Poppins } from "next/font/google";
import { Red_Hat_Display } from "next/font/google";
import { Open_Sans } from "next/font/google";
import ModelDescription from '@/components/ModelDescription';


const roboto = Roboto({ weight: '100', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "500", style: "normal", subsets: ["latin"] });
const poppins = Poppins({ weight: "800", style: "normal", subsets: ["latin"] });
const redHatDisplay = Red_Hat_Display({ weight: '400', style: 'normal', subsets: ['latin'] });
const openSans = Open_Sans({ weight: '400', style: 'normal', subsets: ['latin'] });

import Card
 from '@/components/Card';
export default function UploadDnD() {
    
    return (
        
        <div className="flex w-screen h-screen flex-row items-center justify-center px-20  bg-gradient-to-r from-blue-900 to-blue-700 text-white ">
            <div className="flex flex-row w-full h-screen items-center justify-center text-center ">
                <div className="w-1/2 flex flex-col ">
                    

                    <h1 className={`${montserrat.className} text-7xl`}>Select a Model</h1>
                    <h2 className={`${roboto.className} text-2xl`}>We are actively adding new models to our website</h2>


                </div>
                <div className="w-1/2 flex flex-col space-y-10 items-center justify-center">
                    

                <div className="flex flex-row items-center justify-center space-x-10">

                    <ModelDescription link="/upload/knee-xray" src="/images/knee-sample.png" text="Knee Osteoarthritis Severity Detection"/>
                    <ModelDescription link="/upload/knee-xray" src="/images/knee-sample.png" text="Knee Osteoarthritis Severity Detection"/>

                    </div>
                    

                
                    <div className="flex flex-row items-center justify-center space-x-10">
                    <ModelDescription link="/upload/knee-xray" src="/images/knee-sample.png" text="Knee Osteoarthritis Severity Detection"/>
                    <ModelDescription link="/upload/knee-xray" src="/images/knee-sample.png" text="Knee Osteoarthritis Severity Detection"/>
                    </div>
                    

                    
                </div>

            </div>
            
            
            
        </div>
    );
}
