import React from "react";

import useS3FileUpload from "../hooks/useS3Upload.ts";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../api/fileApi.ts";
import { queryClient } from "../index.tsx";

const FileUploader = () => {
  const {
    mutate: uploadFileMutation,
    isError: isFileUploadError,
    isPending: isFileUploading,
    isSuccess: isFileUploadSuccess,
  } = useMutation({
    onSuccess: async (data) => {
      try {
        queryClient.invalidateQueries({
          queryKey: ["files"],
        });
      } catch (error) {
        console.error("Error invalidating query:", error);
      }
    },
    mutationFn: uploadFile,
    onError: (error) => {
      console.error("Error uploading file:", error);
    },
  });

  const onUploadSuccess = (data: { Location: string; Key: string }) => {
    uploadFileMutation(data);
  };

  const {
    selectedFile,
    isUploading: isS3Uploading,
    errorMessage: s3ErrorMessage,
    handleUpload: handleS3Upload,
    handleFileChange,
  } = useS3FileUpload(onUploadSuccess);

  const totalUploading = isFileUploading || isS3Uploading;

  const totalUploadError =
    !totalUploading && (isFileUploadError || s3ErrorMessage);

  const totalUploadSuccess =
    !totalUploading && !totalUploadError && isFileUploadSuccess;
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <div className="mb-4">
        <button
          onClick={handleS3Upload}
          disabled={totalUploading || !selectedFile}
          className={`w-full py-2 px-4 rounded ${
            totalUploading || !selectedFile
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } transition-colors duration-200`}
        >
          {totalUploading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>
      {totalUploadError && <p className="text-red-500">An Error Occurred</p>}
      {totalUploadSuccess && (
        <p className="text-green-500">File uploaded successfully!</p>
      )}
    </div>
  );
};

export default FileUploader;
