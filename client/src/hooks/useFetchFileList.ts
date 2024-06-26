import { useQuery } from "@tanstack/react-query";
import { IFile } from "../@types/file";
import { fetchFileList } from "../api/fileApi.ts";

export const useFetchFileList = () => {
  return useQuery<IFile[], Error>({
    queryKey: ["files"],
    queryFn: fetchFileList,
  });
};
