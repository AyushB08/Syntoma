import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import Report from './Report';

const KneeDiagnosis = ({ fileurl, onReportSaved }) => {
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
                const requestUrl = `http://127.0.0.1:5000/process_knee?url=${encodedFileUrl}`;
                const response = await fetch(requestUrl);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                let maxConfidence = -1;
                let maxConfidenceKey = null;

                for (const [key, value] of Object.entries(data)) {
                    if (value > maxConfidence) {
                        maxConfidence = value;
                        maxConfidenceKey = key;
                    }
                }

                setLargestConfidence(maxConfidence);
                setSeverityLevel(maxConfidenceKey);

                const confidenceData = {
                    confidence_1: data.healthy,
                    confidence_2: data.moderate,
                    confidence_3: data.severe,
                    username: username,
                    fileurl: fileurl,
                    modeltype: "Knee",
                };

                const postRequest = await fetch("http://localhost:8000/save-knee-report", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(confidenceData),
                });
                setResult(data);

                if (!postRequest.ok) {
                    throw new Error('Failed to update confidence values');
                }

                // Notify that the report has been saved
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
        <div className=" flex flex-col items-center justify-center">
            {loading ? (
                <div className="mt-4">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                result && (
                    <Report fileurl={fileurl} modeltype="Knee" />
                )
            )}
        </div>
    );
};

export default KneeDiagnosis;
