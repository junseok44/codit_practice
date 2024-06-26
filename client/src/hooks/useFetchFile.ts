import { useQuery } from "@tanstack/react-query";
import { fetchFileById } from "../api/fileApi.ts";
import { IFile } from "../@types/file";

export const useFetchFile = (fileId: string | undefined) => {
  return useQuery<IFile, Error>({
    queryKey: ["file", fileId],
    queryFn: () => fetchFileById(fileId!),
    enabled: !!fileId,
    retry: 1,
  });
};
