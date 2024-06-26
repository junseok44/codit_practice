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
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button
        onClick={handleS3Upload}
        disabled={totalUploading || !selectedFile}
      >
        {totalUploading ? "Uploading..." : "Upload PDF"}
      </button>
      {totalUploadError && <p>An Error Occurred</p>}
      {totalUploadSuccess && <p>File uploaded successfully!</p>}
    </div>
  );
};

export default FileUploader;
