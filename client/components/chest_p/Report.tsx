import { useEffect, useState } from "react";
import convertConfInterval from '@/utils/convertConfInterval';
import Image from "next/image";

const Report = ({ fileurl, modeltype }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [largestConfidence, setLargestConfidence] = useState(null);
    const [confidenceKey, setConfidenceKey] = useState("");
    const [date, setDate] = useState(new Date());
    const [subtext, setSubtext] = useState("");

    useEffect(() => {
        const fetchLargestConfidence = async () => {
            try {
                const response = await fetch(`http://localhost:8000/get-chest-p-largest-confidence?fileurl=${encodeURIComponent(fileurl)}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLargestConfidence(data.maxConfidence);
                const confidenceInfo = convertConfInterval(data.maxConfidenceKey, "chestp");
                setConfidenceKey(confidenceInfo.text);
                setSubtext(confidenceInfo.subtext);
                setDate(new Date(data.created_at));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLargestConfidence();
    }, [fileurl]);

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
        <div className="flex items-center gap-6 p-6 rounded-lg  bg-white text-black">
            <div className="flex-shrink-0">
                <Image src={fileurl} alt="X-Ray Image" width={230} height={230} className="rounded-lg" />
            </div>
            <div className="flex-1 space-y-2">
                <div>
                    <h3 className="text-xl font-bold">{modeltype} X-Ray Analysis</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground text-blue-700">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>Scanned on {formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground text-blue-700">
                    <PercentIcon className="w-4 h-4" />
                    <span>Confidence: {largestConfidence * 100}%</span>
                </div>
                <p className="text-muted-foreground">
                    <span className={`items-center justify-center text-center font-bold text-2xl ${confidenceKey === "Healthy" ? "text-green-600" : confidenceKey === "Moderate" ? "text-yellow-400" : "text-red-600"}`}>
                        {confidenceKey}
                    </span>
                </p>
                <p className="w-52">
                    {subtext}
                </p>
            </div>
        </div>
    );
};

function CalendarDaysIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
            <path d="M16 18h.01" />
        </svg>
    );
}

function PercentIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="19" x2="5" y1="5" y2="19" />
            <circle cx="6.5" cy="6.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
    );
}

export default Report;
