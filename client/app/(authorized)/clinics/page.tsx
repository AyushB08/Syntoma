"use client";

import React, { useEffect, useState } from 'react';
import MedicalCenterItem from '@/components/MedicalCenterItem';

const Clinics = () => {
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchMedicalCenters = () => {
      setFetching(true); // Start fetching, show loading indicator
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
            const center = new google.maps.LatLng(latitude, longitude);
            const map = new google.maps.Map(document.createElement('div'));
            const placesService = new google.maps.places.PlacesService(map);

            placesService.nearbySearch(
              {
                location: center,
                radius: 20000,
                type: 'hospital',
                keyword: filter
              },
              (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  setMedicalCenters(results);
                } else {
                  setError('Error fetching medical centers');
                  console.error('Error fetching medical centers:', status);
                }
                setFetching(false); // Finish fetching, hide loading indicator
              }
            );
          },
          (error) => {
            setError('Error getting location');
            console.error('Error getting location:', error);
            setFetching(false); // Finish fetching, hide loading indicator
          }
        );
      } else {
        setError('Geolocation is not supported by this browser');
        console.error('Geolocation is not supported by this browser');
        setFetching(false); // Finish fetching, hide loading indicator
      }
    };

    if (!window.google) {
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAQaxa9Risi64Ovct2U8QKC-6u5R5ot3LQ&libraries=places`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      window.document.body.appendChild(googleMapsScript);
      googleMapsScript.onload = () => {
        fetchMedicalCenters();
      };
    } else {
      fetchMedicalCenters();
    }
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-700 w-screen min-h-screen flex flex-col items-center">
      <div className="flex flex-col w-4/5 mt-32  text-white">
        <p className="text-3xl font-bold">Nearest Clinics</p>
        <p className="text-md text-gray-300 mb-4">Review your past medical scans and images</p>
        <div className="w-1/5 flex flex-row space-x-2">
          <button
            className={`text-center w-1/3 px-4 py-2 rounded-lg ${filter === '' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            onClick={() => handleFilterChange('')}
          >
            All
          </button>
          <button
            className={`text-center  w-1/3 px-4 py-2 rounded-lg ${filter === 'knee orthopedic' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            onClick={() => handleFilterChange('knee orthopedic')}
          >
            Knee
          </button>
          <button
            className={`text-center w-1/3 px-4 py-2 rounded-lg ${filter === 'chest pulmonary' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            onClick={() => handleFilterChange('chest pulmonary')}
          >
            Chest
          </button>
          <button
            className={`text-center w-1/3 px-4 py-2 rounded-lg ${filter === 'spine orthopedic' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            onClick={() => handleFilterChange('spine orthopedic')}
          >
            Spine
          </button>
        </div>
      </div>
      {fetching ? (
        <div className="text-white flex items-center justify-center mt-8">
          <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.004 8.004 0 014 12H0c0 3.042 1.135 5.835 3 7.969l3-2.678zM20 12c0-3.042-1.135-5.835-3-7.969l-3 2.678A8.004 8.004 0 0120 12h4zm-8 8c2.209 0 4-1.791 4-4h-4v4z"></path>
          </svg>
          Loading...
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-4 gap-4 mx-8 mt-8 w-4/5 mb-24">
          {medicalCenters.map((center, index) => (
            <MedicalCenterItem key={index} center={center} currentLocation={currentLocation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Clinics;
