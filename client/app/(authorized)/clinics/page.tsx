"use client";

import React, { useEffect, useState } from 'react';
import MedicalCenterItem from '@/components/MedicalCenterItem';

const Clinics = () => {
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const fetchMedicalCenters = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
            const center = new google.maps.LatLng(latitude, longitude);
            const map = new google.maps.Map(document.createElement('div'));
            const placesService = new google.maps.places.PlacesService(map);

            let keyword = filters.join("|");

            placesService.nearbySearch(
              {
                location: center,
                radius: 20000,
                type: 'hospital',
                keyword: keyword
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
  }, [filters]);

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setFilters([...filters, value]);
    } else {
      setFilters(filters.filter((filter) => filter !== value));
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 min-w-screen min-h-screen flex flex-col items-center justify-center">
      <div className="mt-40 mb-4 flex space-x-4 text-white">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="filter"
            value="chest pulmonary"
            checked={filters.includes("chest pulmonary")}
            onChange={handleFilterChange}
            className="mr-2"
          />
          Chest
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="filter"
            value="knee orthopedic"
            checked={filters.includes("knee orthopedic")}
            onChange={handleFilterChange}
            className="mr-2"
          />
          Knee
        </label>
      </div>
      {fetching ? (
        <div className="text-white">Loading</div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <h1 className="mt-10 text-2xl font-bold mb-4 text-white">Nearest Clinics</h1>
          <ul className="mx-30 text-white w-1/2 pb-32">
            {medicalCenters.map((center, index) => (
              <MedicalCenterItem key={index} center={center} currentLocation={currentLocation} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Clinics;
