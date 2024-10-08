import { useEffect, useState } from "react";

const ConfidenceIntervals = ({ fileurl, reportSaved }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confidences, setConfidences] = useState([]);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        if (!reportSaved) return;

        const fetchConfidences = async () => {
            try {
                const url = `http://localhost:8000/get-chest-p-confidence-intervals?fileurl=${encodeURIComponent(fileurl)}`;
                const response = await fetch(url);

                const data = await response.json();
                const conditionConfidences = [
                    { label: "Healthy", value: data.confidence_1 },
                    { label: "Pneumonia", value: data.confidence_2 },
           
                ];

                setConfidences(conditionConfidences);
                setDate(new Date(data.created_at));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchConfidences();
    }, [fileurl, reportSaved]);

 
    if (loading) {
        return <div>
            
        </div>
    }
    
    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-white text-black p-6 rounded-lg shadow-md h-80 w-60 text-sm overflow-y-auto">
            <div className="grid grid-cols-1 gap-6">
                {confidences.map((confidence, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{confidence.label}</span>
                            <span className="font-medium">{(confidence.value * 100).toFixed(2)}%</span>
                        </div>
                        <div className="h-4 rounded-full bg-muted">
                            <div className="h-full rounded-full bg-blue-700" style={{ width: `${confidence.value * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-500">Scanned on {formattedDate}</p>
            </div>
        </div>
    );
};

export default ConfidenceIntervals;
