"use client";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Scan from "@/components/Scan";  // Adjust the import path according to your project structure
import Link from "next/link";

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

    const handleDelete = async (imageId) => {
        try {
            const response = await fetch("http://localhost:8000/delete-image", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: imageId }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete image");
            }

            // Remove the deleted image from the state
            setImages(images.filter((image) => image.id !== imageId));
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const handleReport = (imageId) => {
        // Implement the report functionality here
        console.log(`Report image with ID: ${imageId}`);
    };

    if (loading) {
        return <div className="w-screen h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const columnsCount = images.length === 1 ? 1 : 2;
    const columnClass = `w-${Math.floor(12 / columnsCount)}/12`; // Calculate column width based on the number of columns

    return (
        <div className="bg-black min-h-screen min-w-screen">
            <div className="h-[10vh] bg-black"></div> 
            <div className="flex flex-col items-center justify-center w-screen bg-black pb-20 text-white">
                <h1 className="text-2xl font-bold mb-4">Images for {username}</h1>
                <Link href="/upload" className="bg-blue-600 px-5 py-2 text-white rounded-lg mb-4">Upload Images Here</Link>
                <div className={`w-3/5 grid grid-cols-${columnsCount} gap-4`}>
                    {images.map((image) => (
                        <div key={image.id} className={`flex flex-col ${columnClass} space-y-4`}>
                            <Scan
                                fileurl={image.fileurl}
                                onDelete={() => handleDelete(image.id)}
                                onReport={() => handleReport(image.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImagesPage;
