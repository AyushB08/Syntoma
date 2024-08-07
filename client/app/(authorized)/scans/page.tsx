"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import Scan from "@/components/Scan";
import Link from "next/link";

const ScansPage = () => {
    const router = useRouter();
    const authContext = useAuth();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    if (!authContext || !authContext.user) {
        router.push("/");
        return null;
    }

    const username = authContext.user.username;

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`http://localhost:8000/get-images?username=${username}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch images");
                }
                const data = await response.json();
                setImages(data.reverse());
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchImages();
    }, [username]);

    const handleDelete = async (fileurl) => {
        try {
            setImages(images.filter((image) => image.fileurl !== fileurl));
            const response = await fetch("http://localhost:8000/delete-image", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileurl: fileurl }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete image");
            }

            // Remove deleted image from state
            
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    if (loading) {
        return <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 text-white"><div className="mt-4">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div></div>;
    }
    /*
    if (error) {
        return <div>Error: {error}</div>;
    }
    */

    return (
        <div className="flex flex-col items-center  min-h-screen bg-gradient-to-r from-blue-900 to-blue-700 text-white">
            <div className="flex flex-col w-4/5 mt-32 space-y-2">
                <p className="text-3xl font-bold">Past Scans</p>
                <p className="text-md text-gray-300">Review your past medical scans and images</p>
            </div>

            <div className="flex flex-col items-center justify-center w-screen my-8 text-white">
               
                <div className="grid grid-cols-4 gap-4 w-4/5 ">
                    {images.map((image) => (
                        <div key={image.id}>
                            <Scan
                                fileurl={image.fileurl}
                                onDelete={handleDelete}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScansPage;
