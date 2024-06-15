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
                <div className=" flex space-x-4 items-center justify-center  text-white">
                    <Link href="/upload/chest-xray" className=" bg-blue-600 rounded-lg px-5 py-2">Chest Xray</Link>
                    <Link href="/upload/knee-xray" className=" bg-blue-600 rounded-lg px-5 py-2">Knee Xray</Link>
                    <Link href="/upload/knee-xray" className=" bg-blue-600 rounded-lg px-5 py-2">Xray</Link>
                </div>
            </div>
            
        </div>
    );
}
