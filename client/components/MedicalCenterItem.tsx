import React from 'react';
import calculateDistance from '@/utils/distance';
import Link from "next/link";
const MedicalCenterItem = ({ center, currentLocation }) => {
  const mapsLink = `https://www.google.com/maps/place/?q=place_id:${center.place_id}`;

  const distance = calculateDistance(
    currentLocation.latitude,
    currentLocation.longitude,
    center.geometry.location.lat(),
    center.geometry.location.lng()
  );

  return (
    <Link className="border border-gray-200 rounded p-4 mb-4 bg-white hover:bg-gray-300 transition duration-300" href={mapsLink}>
      <h3 className="text-lg font-semibold">{center.name}</h3>
      <p className="text-blue-500">{center.vicinity}</p>
      <p className="text-gray-500">Distance: {distance} km</p>
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-500 hover:text-green-700 transition duration-300"
      >
        View on Google Maps
      </a>
    </Link>
  );
};

export default MedicalCenterItem;
