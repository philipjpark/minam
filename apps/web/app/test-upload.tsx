'use client';

import React, { useState } from 'react';

export default function TestUpload() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Test upload - File change event triggered');
    const selectedFiles = event.target.files;
    console.log('Test upload - Files received:', selectedFiles);
    
    if (!selectedFiles || selectedFiles.length === 0) {
      console.log('Test upload - No files selected');
      setError('No files selected');
      return;
    }

    try {
      console.log('Test upload - Processing files...');
      const fileArray = Array.from(selectedFiles);
      console.log('Test upload - File array:', fileArray);
      
      setFiles(selectedFiles);
      setError(null);
      
      // Test accessing first file
      const firstFile = fileArray[0];
      console.log('Test upload - First file:', firstFile);
      console.log('Test upload - First file name:', firstFile?.name);
      
    } catch (err) {
      console.error('Test upload - Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a1a2e' }}>
      <h1>File Upload Test</h1>
      
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: '20px' }}
      />
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}
      
      {files && (
        <div>
          <h2>Selected Files:</h2>
          <ul>
            {Array.from(files).map((file, index) => (
              <li key={index}>
                {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
