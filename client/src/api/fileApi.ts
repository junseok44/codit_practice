export async function fetchFileList() {
  const response = await fetch(`/api/files`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch files");
  }
  const result = await response.json();

  return result.data;
}

export async function fetchFileById(fileId: string) {
  const response = await fetch(`/api/file/${fileId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch file");
  }
  const result = await response.json();

  return result.data;
}

export async function uploadFile(data: { Location: string; Key: string }) {
  const response = await fetch(`/api/file`, {
    method: "POST",
    body: JSON.stringify({
      url: data.Location,
      key: data.Key,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to upload file");
  }
  return response.json();
}
