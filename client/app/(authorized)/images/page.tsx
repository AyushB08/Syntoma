"use client";

import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ImagesPage = () => {
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
                setImages(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchImages();
    }, [username]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="h-[10vh]"></div> 
            <div className="flex flex-col items-center justify-center w-screen bg-gradient-to-b from-blue-100 to-white">
                <h1 className="text-2xl font-bold mb-4">Images for {username}</h1>
                <div className="flex flex-col items-center w-full">
                    {images.map((image) => (
                        <div key={image.id} className="w-1/3 mb-4">
                            <img
                                src={image.fileurl}
                                alt="User Image"
                                className="w-full h-auto object-cover rounded-lg shadow-lg border-white border"
                            />
                        </div>
                    ))}
                </div>
            </div>

        </>
        
    );
};

export default ImagesPage;
