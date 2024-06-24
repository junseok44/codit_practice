import React, { useEffect, useState } from "react";
import useS3FileUpload from "./hooks/useS3Upload.ts";
import { IFile } from "./@types/file";

const App = () => {
  const onUploadSuccess = (data: { Location: string; Key: string }) => {
    fetch(`/api/file`, {
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
    fetch(`/api/files`)
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
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
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

  const [files, setFiles] = useState<IFile[]>([]);

  useEffect(() => {
    getFileList();
  }, []);

  return (
    <div>
      <ul>
        {files.map((file) => (
          <a key={file.id} href={`/file/${file.id}`}>
            <li>{file.name}</li>
          </a>
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
