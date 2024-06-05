import React, { useState } from 'react';
import axios from 'axios'; // Make sure to have axios installed

const FileUploadButton = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true); // Set uploading state to true while uploading

    try {
      const response = await axios.post('http://localhost:8000/upload', formData);
      console.log(response.data); 
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false); // Set uploading state back to false after upload completes
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ backgroundColor: 'blue', color: 'white' }}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FileUploadButton;
