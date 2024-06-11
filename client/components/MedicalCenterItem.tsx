import React from 'react';

const MedicalCenterItem = ({ center }) => {
  return (
    <li className="border border-gray-200 rounded p-4 mb-4">
      <h3 className="text-lg font-semibold">{center.name}</h3>
      <p className="text-blue-500">{center.vicinity}</p>
    </li>
  );
};

export default MedicalCenterItem;
