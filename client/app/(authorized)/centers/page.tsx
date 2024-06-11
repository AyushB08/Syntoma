"use client";

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import MedicalCenterItem from '@/components/MedicalCenterItem';

const Centers = () => {

  const [medicalCenters, setMedicalCenters] = useState([]);
  const [fetching, setFetching] = useState(true); 

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalCenters = () => {
      if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const center = new google.maps.LatLng(latitude, longitude);
            const map = new google.maps.Map(document.createElement('div'));
            const placesService = new google.maps.places.PlacesService(map);

            placesService.nearbySearch(
              {
                location: center, radius: 5000,
                type: 'hospital',
              },
              (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  setMedicalCenters(results);
                } else {
                  setError('Error fetching medical centers');
                  console.error('Error fetching medical centers:', status);
                }
                setFetching(false); 
              }
            );
          },
          (error) => {
            setError('Error getting location');
            console.error('Error getting location:', error);
            setFetching(false); 
          }
        );
      } else {
        setError('Geolocation is not supported by this browser');
        console.error('Geolocation is not supported by this browser');
        setFetching(false); 
      }
    };

    fetchMedicalCenters();
  }, []);

  return (
    <div className="bg-black min-w-screen min-h-screen flex flex-col items-center justify-center ">
      <Script src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAQaxa9Risi64Ovct2U8QKC-6u5R5ot3LQ&libraries=places`} strategy="beforeInteractive" />
      
      {fetching ? ( 
        <div className=" text-white">
            Loading
        </div>
      ) : (
        
        error ? ( 
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <h1 className="mt-32 text-2xl font-bold mb-4 text-white">Nearest Medical Centers</h1>
            <ul className="mx-30 text-white w-1/2 pb-32">
                {medicalCenters.map((center, index) => (
                <MedicalCenterItem key={index} center={center} />
                ))}
            </ul>
          </>
        )
      )}
    </div>
  );
};

export default Centers;
