import { useState, ChangeEvent } from "react";
import AWS from "aws-sdk";

const useS3FileUpload = (
  onUploadSuccess: (data: AWS.S3.ManagedUpload.SendData) => void
) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];

      if (!file) return;

      if (file.type !== "application/pdf") {
        setErrorMessage("Only PDF files are allowed.");
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setErrorMessage("");
        setUploadSuccess(false);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    setIsUploading(true);

    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: selectedFile.name,
      Body: selectedFile,
      ContentType: "application/pdf",
    };

    try {
      const data = await s3.upload(params).promise();

      onUploadSuccess(data);

      setUploadSuccess(true);
    } catch (error) {
      console.log("Error uploading to s3 :", error);

      setErrorMessage(`Error uploading file: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    selectedFile,
    isUploading,
    uploadSuccess,
    errorMessage,
    handleFileChange,
    handleUpload,
  };
};

export default useS3FileUpload;
