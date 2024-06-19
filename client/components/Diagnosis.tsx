import { useState } from "react";

const Diagnosis = ({ fileurl, modeltype }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [largestConfidence, setLargestConfidence] = useState(null);

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

            // Extracting the confidence values from the data
            const confidences = Object.values(data);
            const maxConfidence = Math.max(...confidences);

            setResult(data);
            setLargestConfidence(maxConfidence);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black w-screen h-screen flex flex-col items-center justify-center">
            <p className="text-white">Here is your {modeltype} image</p>
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
                    <h2>Largest Confidence Interval:</h2>
                    <p className="text-xl font-bold">{largestConfidence}</p>
                </div>
            )}
        </div>
    );
};

export default Diagnosis;
