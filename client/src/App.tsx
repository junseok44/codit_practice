import React from "react";
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
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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

  return (
    <div>
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
