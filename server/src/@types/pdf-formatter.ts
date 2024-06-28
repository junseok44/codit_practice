export interface PdfParseResult {
  pageTables: {
    page: number;
    tables: string[][];
  }[];
}
