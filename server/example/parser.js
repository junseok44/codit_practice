import pdf from "pdf-parse";
import fs from "fs";

const dataBuffer = fs.readFileSync("./test.pdf");
const data = await pdf(dataBuffer);
console.log(data);
