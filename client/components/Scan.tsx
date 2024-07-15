import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import KneeReport from "./knee/Report";
import ChestReport from "./chest/Report";

export default function Scan({ fileurl, onDelete }) {
    const [showReportCard, setShowReportCard] = useState(false);
    const [scanInfo, setScanInfo] = useState({});

    useEffect(() => {
        fetchScanInfo();
    }, []);

    const fetchScanInfo = async () => {
        try {
            const response = await fetch(`http://localhost:8000/get-scan-info?fileurl=${encodeURIComponent(fileurl)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch scan information");
            }
            const data = await response.json();
            setScanInfo(data);
        } catch (error) {
            console.error("Error fetching scan information:", error);
        }
    };

    const handleReportClick = () => {
        setShowReportCard(!showReportCard);
    };

    const handleCloseReportCard = () => {
        setShowReportCard(false);
    };

    return (
        <div className="relative">
            <div className="bg-white rounded-lg shadow-lg p-4">
                <img
                    src={fileurl}
                    alt="User Image"
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
                <p className="text-left mt-2 mb-1 text-sm font-bold text-black">
                    {scanInfo.modeltype ? `${scanInfo.modeltype} X-Ray - ${new Date(scanInfo.created_at).toLocaleDateString()}` : "Loading..."}
                </p>

                <div className="mt-2">
                    <button
                        className="bg-blue-700 text-white w-full py-2 rounded mb-2"
                        onClick={handleReportClick}
                    >
                        View Scan
                    </button>
                    <button
                        className="bg-red-600 text-white w-full py-2 rounded"
                        onClick={() => onDelete(fileurl)}
                    >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                </div>
            </div>

            {showReportCard && (
                <div className="fixed inset-0 bg-gray-400 bg-opacity-90 flex items-center justify-center z-50 shadow-3xl">
                    <div className="relative rounded-lg p-6 bg-white bg-opacity-100">
                        <button
                            className="absolute top-4 right-4 text-black px-2 rounded"
                            onClick={handleCloseReportCard}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        
                        {scanInfo.modeltype === "Knee" ? (
                            <KneeReport fileurl={fileurl} modeltype={scanInfo.modeltype} />
                        ) : (
                            <ChestReport fileurl={fileurl} modeltype={scanInfo.modeltype} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
