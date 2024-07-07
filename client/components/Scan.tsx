import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFile, faTimes } from "@fortawesome/free-solid-svg-icons";
import Report from "./Report";

export default function Scan({ fileurl, onDelete }) {
    const [showReportCard, setShowReportCard] = useState(false);

    const handleReportClick = () => {
        setShowReportCard(!showReportCard);
    };

    const handleCloseReportCard = () => {
        setShowReportCard(false);
    };

    return (
        <div className="relative">
            <img
                src={fileurl}
                alt="User Image"
                className="w-full h-auto object-cover rounded-lg shadow-lg "
            />
            <button
                className="absolute top-2 right-2 bg-blue-500 text-white px-2 rounded"
                onClick={() => onDelete(fileurl)} // Pass fileurl to onDelete
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
            <button
                className="absolute top-10 right-2 bg-blue-500 text-white px-2 rounded"
                onClick={handleReportClick}
            >
                <FontAwesomeIcon icon={faFile} />
            </button>

            {showReportCard && (
                <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                    <div className="relative bg-black p-1 rounded-lg shadow-lg">
                        <button
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 rounded"
                            onClick={handleCloseReportCard}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <Report fileurl={fileurl} modeltype="knee" />
                    </div>
                </div>
            )}
        </div>
    );
}
