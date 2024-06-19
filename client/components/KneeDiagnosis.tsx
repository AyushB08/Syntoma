import { useState } from "react";

const KneeDiagnosis = ({ fileurl }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [largestConfidence, setLargestConfidence] = useState(null);
    const [severityLevel, setSeverityLevel] = useState(null);

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

            // Extracting the confidence values from the data and finding the max confidence and its key
            let maxConfidence = -1;
            let maxConfidenceKey = null;

            for (const [key, value] of Object.entries(data)) {
                if (value > maxConfidence) {
                    maxConfidence = value;
                    maxConfidenceKey = key;
                }
            }

            setResult(data);
            setLargestConfidence(maxConfidence);
            setSeverityLevel(maxConfidenceKey);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black w-screen h-screen flex flex-col items-center justify-center">
            <p className="text-white">Here is your knee image</p>
            <img alt="Your Scan" src={fileurl} width={200} height={200} />

            <button
                onClick={handleViewResults}
                className="flex flex-col items-center justify-center text-white bg-blue-600 px-3 py-2 mt-4 rounded-lg"
            >
                {loading ? (
                    <h1 className="text-xl font-bold">Processing...</h1>
                ) : (
                    <>
                        <h1 className="text-xl font-bold">View Results</h1>
                        <h2 className="text-sm text-gray-300">This may take some time</h2>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-4 text-white">
                    <h2>Diagnosis Result:</h2>
                    <p className="text-xl">
                        Our model has detected this case has a {largestConfidence * 100}% chance of being a <span className="text-red-700 font-bold capitalize">{severityLevel}</span> case of this disease.
                    </p>
                </div>
            )}
        </div>
    );
};

export default KneeDiagnosis;
