import React from "react";
import { useFetchFileList } from "../hooks/useFetchFileList.ts";

const FileList = () => {
  const {
    data: files,
    isLoading: isFileLoading,
    isError: isFileError,
  } = useFetchFileList();

  if (isFileLoading || isFileLoading) {
    return <p>Loading...</p>;
  }

  if (isFileError || !files) {
    return <p>An error occurred.</p>;
  }

  console.log(files);

  return (
    <>
      <h1 className="text-2xl">Files</h1>
      <ul>
        {files.map((file) => (
          <a key={file.id} href={`/file/${file.id}`}>
            <li>{file.name}</li>
          </a>
        ))}
      </ul>
    </>
  );
};

export default FileList;
