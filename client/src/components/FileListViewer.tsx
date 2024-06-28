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

  return (
    <>
      <ul className="bg-white shadow-lg rounded-lg overflow-hidden">
        {files.map((file) => (
          <li key={file.id} className="border-b last:border-none">
            <a
              href={`/file/${file.id}`}
              className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
            >
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FileList;
