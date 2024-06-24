export interface IFile {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  parsedData: any[];
}

// model PdfDocument {
//     id         String   @id @default(auto()) @map("_id") @db.ObjectId
//     name       String
//     url        String
//     createdAt  DateTime @default(now()) @map("_createdAt")
//     updatedAt  DateTime @updatedAt @map("_updatedAt")
//     parsedData Json[]
//   }
