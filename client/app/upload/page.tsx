"use client";
import "@uploadthing/react/styles.css";
import { UploadDropzone } from "@uploadthing/react";
import { useState } from 'react';
import Link from "next/link";

export default function UploadDnD() {
    const [fileUrl, setFileUrl] = useState<string>("");

    const handleUploadComplete = (res) => {
        console.log("Response:", res);
        if (res && res.length > 0) {
            const uploadedFile = res[0]; 
            setFileUrl(uploadedFile.url);
            const json = JSON.stringify(uploadedFile);
            console.log(json);
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
