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

    const imgWidth = 200;

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
        <main className="bg-gradient-to-r from-blue-800 to-blue-600 flex w-screen h-screen flex-col items-center justify-center text-white">
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
                        <div className="w-1/2 mx-10 flex flex-col items-center justify-center text-center">
                            <h1 className={`${montserrat.className} text-6xl`}>Acceptable X-Rays</h1>
                            <h2 className={`${roboto.className} text-2xl`}>Please ensure your scans follow this format</h2>
                            <div className="items-center justify-center space-x-3 flex flex-row mt-6">
                                <Image className="rounded-lg" src="/images/knee-sample.png" alt="image" height={imgWidth} width={imgWidth} />
                                <Image className="rounded-lg" src="/images/knee-sample.png" alt="image" height={imgWidth} width={imgWidth} />
                            </div>
                        </div>
                        <div className="w-1/2 h-full flex flex-col items-center justify-center">
                            <UploadDropzone
                                endpoint="imageUploader"
                                onClientUploadComplete={handleUploadComplete}
                                onUploadError={(error: Error) => {
                                    alert(`ERROR! ${error.message}`);
                                }}
                                className="bg-white h-3/5 w-4/5"
                            />
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
