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
        console.log("Fetched file:", data.data);

        setFile(data.data);
      })
      .catch((error) => {
        console.error("Error fetching file:", error);
      });
  }, [fileId]);

  if (!file) {
    return <h1>Loading...</h1>;
  }

  const coupledData = file.parsedData[0].map((column, index) => {
    return [column, file.parsedData[1][index]];
  });

  return (
    <>
      <button>
        <a href="/">홈으로.</a>
      </button>

      <div>
        <h1 className="text-2xl">{file.name}</h1>
        <div className="flex items-center justify-between">
          <PdfViewer url={`${file.url}`} />
          <table class="custom-table">
            <thead>
              <tr>
                <th>현행</th>
                <th>개정안</th>
              </tr>
            </thead>
            <tbody>
              {coupledData.map((data, index) => (
                <tr key={index}>
                  <td>{data[0]}</td>
                  <td>{data[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FilePage;
