
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import Report from './Report';

const KneeDiagnosis = ({ fileurl }) => {
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
                console.log('Results:', data);

                let maxConfidence = -1;
                let maxConfidenceKey = null;

                for (const [key, value] of Object.entries(data)) {
                    if (value > maxConfidence) {
                        maxConfidence = value;
                        maxConfidenceKey = key;
                    }
                }

                // return jsonify({"healthy": final_predictions[0], "doubtful": final_predictions[1], "minimal": final_predictions[2], "moderate": final_predictions[3], "severe": final_predictions[4]}), 200
                setLargestConfidence(maxConfidence);
                setSeverityLevel(maxConfidenceKey);
                console.log("DATA: " + JSON.stringify(data));
                const confidenceData = {
                    confidence_1: data.healthy,
                    confidence_2: data.doubtful,
                    confidence_3: data.minimal,
                    confidence_4: data.moderate,
                    confidence_5: data.severe,
                    username: username,
                    fileurl: fileurl,
                    modeltype: "knee",
                };

                console.log("hello passed here1");

                const postRequest = await fetch("http://localhost:8000/save-report", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(confidenceData),
                });
                setResult(data);
                console.log("hello passed here");

                if (!postRequest.ok) {
                    throw new Error('Failed to update confidence values');
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            } finally {
                setLoading(false);
            }
        };

        handleViewResults();
    }, [fileurl, username]);

    return (
        <div className="bg-black w-screen h-screen flex flex-col items-center justify-center">
            <p className="text-white">Here is your knee image</p>
            <img alt="Your Scan" src={fileurl} width={200} height={200} />

            {loading ? (
                <button className="flex flex-col items-center justify-center text-white bg-blue-600 px-3 py-2 mt-4 rounded-lg">
                    <h1 className="text-xl font-bold">Processing...</h1>
                    <h2 className="text-sm text-gray-300">This may take some time</h2>
                </button>
            ) : (
                result && (
                    <Report fileurl={fileurl} modeltype="knee" />
                )
            )}
        </div>
    );
};

export default KneeDiagnosis;
