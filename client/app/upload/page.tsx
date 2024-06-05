"use client";
import "@uploadthing/react/styles.css";
import { UploadDropzone } from "@uploadthing/react";
import { useState } from 'react';
import Link from "next/link";
import { useAuth } from "@/contexts/authContext";
import {useRouter } from "next/navigation";

export default function UploadDnD() {
    const router = useRouter();
    const authContext = useAuth();
 
    if (!authContext || !authContext.user) {
        router.push("/");
        return null; 
    }

    const [fileUrl, setFileUrl] = useState<string>("");

    const handleUploadComplete = async (res) => {
        console.log("Response:", res);
        if (res && res.length > 0) {
            const uploadedFile = res[0];
            setFileUrl(uploadedFile.url);
            const json = JSON.stringify(uploadedFile);
            console.log(json);

            // Make API call to save username and file URL to images database using fetch
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
                console.error("Error saving image data:");
            }
        }
    };

    const imgElement = fileUrl ? (
        <>
            <p>Upload Complete!</p>
            <p className="mt-2">File URL: {fileUrl}</p>
            <Link href={fileUrl} target="_blank">
                View File
            </Link>
        </>
    ) : null;

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-24">
            <UploadDropzone<OurFileRouter>
                endpoint="imageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                }}
            />
            {imgElement}
        </main>
    );
}