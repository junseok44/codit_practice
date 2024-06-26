import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IFile, ResultTableData } from "../@types/file";
import PdfViewer from "../components/PdfViewer.tsx";
import { useFetchFile } from "../hooks/useFetchFile.ts";
import { adjustLength } from "../utils/adjustLength.ts";
import CoupledTable from "../components/CoupledTable.tsx";

const FilePage = () => {
  const { fileId } = useParams();

  const { data: file, isLoading, isError } = useFetchFile(fileId);

  if (!file && isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError || !file) {
    return (
      <h1>
        Error occurred
        <a href="/">홈으로.</a>
      </h1>
    );
  }

  return (
    <>
      <button>
        <a href="/">홈으로.</a>
      </button>
      <div>
        <h1 className="text-2xl">{file.name}</h1>
        <div className="flex items-start justify-between">
          <PdfViewer url={`${file.url}`} />
          <CoupledTable parsedData={file.parsedData} />
        </div>
      </div>
    </>
  );
};

export default FilePage;
