import React, { useEffect, useState } from "react";
import useS3FileUpload from "./hooks/useS3Upload.ts";

const App = () => {
  const onUploadSuccess = (data: { Location: string; Key: string }) => {
    console.log("File uploaded to:", data.Location);

    fetch("/api/file", {
      method: "POST",
      body: JSON.stringify({
        url: data.Location,
        key: data.Key,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to upload file");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        getFileList();
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const getFileList = () => {
    fetch("/api/files")
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to fetch files");
          });
        }
        return response.json();
      })
      .then((data) => {
        setFiles(data.data);
      });
  };

  const {
    selectedFile,
    uploading,
    uploadSuccess,
    errorMessage,
    handleFileChange,
    handleUpload,
  } = useS3FileUpload(onUploadSuccess);

  const [files, setFiles] = useState([]);

  useEffect(() => {
    getFileList();
  }, []);

  return (
    <div>
      <ul>
        {files.map((file) => (
          <li key={file.id}>{file.name}</li>
        ))}
      </ul>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading || !selectedFile}>
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
      {uploadSuccess && <p>File uploaded successfully!</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default App;
