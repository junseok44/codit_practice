export type ResultTableData = [string[], string[]];

export interface IFile {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  parsedData: ResultTableData;
}
