import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IFile } from "../@types/file";
import PdfViewer from "../components/PdfViewer.tsx";

const FilePage = () => {
  const { fileId } = useParams();

  const [file, setFile] = useState<IFile | null>(null);

  useEffect(() => {
    fetch(`/api/file/${fileId}`)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to fetch file");
          });
        }
        return response.json();
      })
      .then((data) => {
        setFile(data.data);
      })
      .catch((error) => {
        console.error("Error fetching file:", error);
      });
  }, [fileId]);

  return (
    <div>
      {file ? (
        <div>
          <h1>{file.name}</h1>
          <PdfViewer url={`${file.url}`} />
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default FilePage;
