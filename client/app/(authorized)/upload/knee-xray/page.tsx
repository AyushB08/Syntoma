"use client";

import "@uploadthing/react/styles.css";
import { UploadDropzone } from "@uploadthing/react";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import Diagnosis from "@/components/Diagnosis";

export default function UploadDnD() {
    const router = useRouter();
    const authContext = useAuth();
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleUploadComplete = async (res) => {
        console.log("Response:", res);
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

    return (
        <main className="flex w-screen h-screen flex-col items-center justify-center p-24 bg-black text-white">
            {fileUrl ? (
                <Diagnosis fileurl={fileUrl} modeltype="knee" />
            ) : (
                <>
                    <p>Upload your image</p>
                    <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={handleUploadComplete}
                        onUploadError={(error: Error) => {
                            alert(`ERROR! ${error.message}`);
                        }}
                    />
                </>
            )}
        </main>
    );
}