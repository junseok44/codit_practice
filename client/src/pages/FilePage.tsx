import React from "react";
import { useParams } from "react-router-dom";
import PdfViewer from "../components/PdfViewer.tsx";
import { useFetchFile } from "../hooks/useFetchFile.ts";
import CoupledTable from "../components/CoupledTable.tsx";
import { PageLayout } from "../components/@common/Layout.tsx";

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
    <PageLayout>
      <div className="h-screen flex flex-col py-6">
        <div className="flex h-[4rem] items-center gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            <a href="/">홈으로</a>
          </button>
          <h1 className="text-2xl font-semibold">{file.name}</h1>
        </div>
        <div className="flex-grow flex overflow-hidden">
          <div className="w-1/2 h-full flex flex-col">
            <PdfViewer url={file.url} />
          </div>
          <CoupledTable parsedData={file.parsedData} />
        </div>
      </div>
    </PageLayout>
  );
};

export default FilePage;
