import React, { useRef, useState } from 'react';

type FileUploaderProps = {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => void;
};

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default behavior to allow for drop event handling
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click(); // Programmatically click the hidden file input
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    onFileSelect(event);
    const files = 'dataTransfer' in event ? event.dataTransfer.files : event.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleFileChange}
      className="border-4 border-dotted border-gray-400 rounded-md p-6 w-full text-center mb-4 cursor-pointer hover:bg-gray-50"
      onClick={triggerFileUpload}
    >
      <p className="text-gray-800 text-lg font-semibold">Blueriq profiel of aggregaat bestand uploaden of slepen</p>
      {fileName && <div className="mt-1 text-gray-600">{fileName}</div>}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".xml,.txt"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;