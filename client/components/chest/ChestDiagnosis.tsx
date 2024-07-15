import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import Report from './Report';

const ChestDiagnosis = ({ fileurl, onReportSaved }) => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [largestConfidence, setLargestConfidence] = useState(null);
    const [severityLevel, setSeverityLevel] = useState(null);
    const authContext = useAuth();
    const username = authContext.user.username;

    useEffect(() => {
        const handleViewResults = async () => {
            setLoading(true);
            try {
                const encodedFileUrl = encodeURIComponent(fileurl);
                const requestUrl = `http://127.0.0.1:5000/process_chest?url=${encodedFileUrl}`;
                const response = await fetch(requestUrl);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log("MAIN DATA: " +  JSON.stringify(data)); 
                console.log("DATA PLUERAL: " + data.PleuralThickening);

               
                const confidenceData = {
                    confidence_1: data.Atelectasis,
                    confidence_2: data.Cardiomegaly,
                    confidence_3: data.Consolidation,
                    confidence_4: data.Edema,
                    confidence_5: data.Effusion,
                    confidence_6: data.Emphysema,
                    confidence_7: data.Fibrosis,
                    confidence_8: data.Infiltration,
                    confidence_9: data.Mass,
                    confidence_10: data.Nodule,
                    confidence_11: data.PleuralThickening,
                    confidence_12: data.Pneumonia,
                    confidence_13: data.Pneumothorax,
                    username: username,
                    fileurl: fileurl,
                    modeltype: "Chest",
                };

                const postRequest = await fetch("http://localhost:8000/save-chest-report", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(confidenceData),
                });

                if (!postRequest.ok) {
                    throw new Error('Failed to update confidence values');
                }

                setResult(data);

                
                onReportSaved();
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            } finally {
                setLoading(false);
            }
        };

        handleViewResults();
    }, [fileurl, username, onReportSaved]);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            {loading ? (
                <button className="text-white bg-blue-600 px-3 py-2 mt-4 rounded-lg">
                    <h1 className="text-xl font-bold">Processing...</h1>
                </button>
            ) : (
                result && <Report fileurl={fileurl} modeltype="Chest" />
            )}
        </div>
    );
};

export default ChestDiagnosis;
