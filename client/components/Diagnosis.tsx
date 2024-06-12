import Image from "next/image";

const Diagnosis = ({ fileurl, modeltype }) => {
    return (
        <div className="bg-black w-screen h-screen flex flex-col items-center justify-center">
            <p className="text-white">Here is your image</p>
            <Image alt="Your Scan" src={fileurl} width={200} height={200} />

            <button className="flex flex-col items-center justify-center text-white bg-blue-600 px-3 py-2 mt-4 rounded-lg">
                <h1 className="text-xl font-bold">View Results</h1>
                <h2 className="text-sm text-gray-300">This may take some time</h2>
            </button>
        </div>
    );
};

export default Diagnosis;
