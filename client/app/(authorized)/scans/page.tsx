"use client";

import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
        setImages(images.filter((image) => image.fileurl !== fileurl)); // Remove image from state
        try {
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
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    if (loading) {
        return <div className="w-screen h-screen flex items-center justify-center  bg-gradient-to-r from-blue-800 to-blue-600 text-white">Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="min-h-screen min-w-screen bg-gradient-to-r from-blue-900 to-blue-700">
            <div className="h-[10vh]"></div>
            <div className="flex flex-col items-center justify-center w-screen pb-20 text-white">
                <h1 className="text-2xl font-bold mb-4">Scans for {username}</h1>
                <Link href="/upload" className="bg-blue-600 px-5 py-2 text-white rounded-lg mb-4">
                    Upload Scans Here
                </Link>
                <div className="w-3/5 flex flex-row space-x-2">
                    {images.length === 1 ? (
                        <div className="flex flex-col w-full space-y-2">
                            {images.map((image) => (
                                <div key={image.id}>
                                    <Scan
                                        fileurl={image.fileurl}
                                        onDelete={handleDelete} // Pass handleDelete function
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col w-1/2 space-y-2">
                                {images.slice(0, Math.ceil(images.length / 2)).map((image) => (
                                    <div key={image.id}>
                                        <Scan
                                            fileurl={image.fileurl}
                                            onDelete={handleDelete} // Pass handleDelete function
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col w-1/2 space-y-2">
                                {images.slice(Math.ceil(images.length / 2)).map((image) => (
                                    <div key={image.id}>
                                        <Scan
                                            fileurl={image.fileurl}
                                            onDelete={handleDelete} // Pass handleDelete function
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScansPage;
