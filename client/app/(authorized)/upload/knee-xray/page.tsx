"use client";

import "@uploadthing/react/styles.css";
import { UploadDropzone } from "@uploadthing/react";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import KneeDiagnosis from "@/components/KneeDiagnosis";
import Image from "next/image";

import { Montserrat } from "next/font/google";
import { Roboto } from "next/font/google";
import { Poppins } from "next/font/google";
import { Red_Hat_Display } from "next/font/google";
import { Open_Sans } from "next/font/google";
import ModelDescription from '@/components/ModelDescription';
import Card from "@/components/Card";
import ConfidenceIntervals from "@/components/ConfidenceIntervals";

const roboto = Roboto({ weight: '100', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "500", style: "normal", subsets: ["latin"] });
const poppins = Poppins({ weight: "800", style: "normal", subsets: ["latin"] });
const redHatDisplay = Red_Hat_Display({ weight: '400', style: 'normal', subsets: ['latin'] });
const openSans = Open_Sans({ weight: '400', style: 'normal', subsets: ['latin'] });

export default function UploadDnD() {
    const router = useRouter();
    const authContext = useAuth();
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [reportSaved, setReportSaved] = useState(false);

    const imgWidth = 250;

    const handleUploadComplete = async (res) => {
        if (res && res.length > 0) {
            const uploadedFile = res[0];
            setFileUrl(uploadedFile.url);

            try {
                const response = await fetch("http://localhost:8000/save-image", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: authContext.user.username,
                        fileurl: uploadedFile.url,
                    }),
                });
                if (response.ok) {
                    console.log("Image data saved to database");
                } else {
                    throw new Error("Failed to save image data");
                }
            } catch (error) {
                console.error("Error saving image data:", error);
            }
        }
    };

    const handleReportSaved = () => {
        setReportSaved(true);
    };

    return (
        <main className="bg-gradient-to-r from-blue-900 to-blue-700 flex w-screen h-screen flex-col items-center justify-center text-white">
            {fileUrl ? (
                <>
                    <div className="flex flex-row items-center justify-center space-x-4">

                        <KneeDiagnosis fileurl={fileUrl} onReportSaved={handleReportSaved} />
                        <ConfidenceIntervals fileurl={fileUrl} reportSaved={reportSaved} />

                    </div>
                    
                </>
            ) : (
                <>
                    <div className="w-screen h-screen flex flex-row items-center justify-center">
                        <div className="w-1/2 mx-10 flex flex-col items-center justify-center text-center  ">
                            <h1 className={`${montserrat.className} text-3xl`}>Acceptable X-Rays</h1>
                            <h2 className={`${roboto.className} text-xl`}>Please ensure your scans follow this format</h2>
                            <div className="justify-normal items-start text-start">

                                <p className="text-gray-300 mt-8">File format: PNG (.png) or JPEG (.jpg, .jpeg)</p>
                                <p className="text-gray-300 ">Image size: Minimum 128x128 pixels</p>
                                <p className="text-gray-300 ">File size: Maximum 4MB per image</p>
                            </div>
                            
                            
                            
                            <div className="space-x-6 flex flex-row mt-8 items-center justify-center text-center">
                                <Image className="rounded-xl shadow-2xl transform transition-transform duration-300 hover:scale-105" src="/images/knee-sample.png" alt="image" height={imgWidth} width={imgWidth} />
                                <Image className="rounded-xl shadow-2xl transform transition-transform duration-300 hover:scale-105 " src="/images/knee-sample.png" alt="image" height={imgWidth} width={imgWidth} />
                            </div>

                        </div>
                        <div className="w-1/2 h-full flex flex-col items-center justify-center">
                            <UploadDropzone
                                endpoint="imageUploader"
                                onClientUploadComplete={handleUploadComplete}
                                onUploadError={(error: Error) => {
                                    alert(`ERROR! ${error.message}`);
                                }}
                                className="bg-white h-3/5 w-4/5 transform transition-transform duration-300  hover:bg-gray-200"
                            />
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
