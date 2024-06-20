import { useEffect, useState } from "react";

const Report = ({ fileurl, modeltype }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [largestConfidence, setLargestConfidence] = useState(null);
    const [confidenceKey, setConfidenceKey] = useState(null);

    useEffect(() => {
        const fetchLargestConfidence = async () => {
            try {
                const response = await fetch(`http://localhost:8000/get-largest-confidence?fileurl=${encodeURIComponent(fileurl)}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLargestConfidence(data.maxConfidence);
                setConfidenceKey(data.maxConfidenceKey);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLargestConfidence();
    }, [fileurl]);

    if (loading) {
        return <p className="text-blue-500">Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="mt-4 text-blue-500">
            <h2>Diagnosis Result:</h2>
            <p className="text-xl">
                Our model has detected this case has a {largestConfidence * 100}% chance of being a {confidenceKey} case of this disease.
            </p>
            <p>File URL: {fileurl}</p>
            <p>Model Type: {modeltype}</p>
        </div>
    );
};

export default Report;
