import { ResultTableData } from "../@types/file";

export const adjustLength = (columns: ResultTableData): ResultTableData => {
  const maxLength = Math.max(columns[0].length, columns[1].length);

  const adjustedColumns: ResultTableData = [[...columns[0]], [...columns[1]]];

  while (adjustedColumns[0].length < maxLength) {
    adjustedColumns[0].push("");
  }

  while (adjustedColumns[1].length < maxLength) {
    adjustedColumns[1].push("");
  }

  return adjustedColumns;
};
