"use client";

import { useState } from 'react';
import Link from "next/link";
import { useAuth } from "@/contexts/authContext";
import {useRouter } from "next/navigation";

export default function UploadDnD() {
    
    return (
        <div className="flex w-screen h-screen flex-col items-center justify-center p-24 bg-black text-white space-y-10">
            <p>Select a Region</p>
            <div className="flex flex-row">
                <div className=" flex items-center justify-center  text-black">
                    <Link href="/upload/xray" className=" bg-white rounded-lg p-10">Xray</Link>
                </div>
            </div>
            
        </div>
    );
}
