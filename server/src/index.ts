import express from "express";
import bodyParser from "body-parser";
import db from "./config/db";
import { PdfParseResult } from "./@types/pdf-formatter";

const app = express();
const PORT = process.env.SERVER_PORT || 8000;

app.use(bodyParser.json());

app.get("/api/files", async (req, res) => {
  try {
    const data = await db.pdfDocument.findMany({
      select: {
        id: true,
        name: true,
        url: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Files fetched successfully!",
      data,
    });
  } catch (error) {
    console.error("Error fetching files:", error);

    res.status(500).send({
      message: "Error fetching files",
    });
  }
});

app.get("/api/file/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const file = await db.pdfDocument.findUnique({
      where: {
        id: id,
      },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.send({
      message: "File fetched successfully!",
      data: file,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/file", async (req, res) => {
  const { url, key } = req.body;

  if (!url || !key) {
    return res.status(400).send({
      message: "URL and key are required",
    });
  }

  try {
    const result = (await require("./lib/pdf-table-extractor.js")(
      url
    )) as PdfParseResult | null;

    if (!result) {
      return res.status(400).send({
        message: "Error parsing file",
      });
    }

    const { default: tableDataFormatter } = await import(
      "./lib/table-data-formatter"
    );

    let parsedData = tableDataFormatter(result);

    const data = await db.pdfDocument.create({
      data: {
        name: key,
        url,
        parsedData: parsedData,
      },
    });

    res.json({
      message: "File uploaded successfully!",
      data,
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    res.status(500).send({
      message: "Error uploading file",
    });
  }
});

app.get("/api/removeall", async (req, res) => {
  try {
    await db.pdfDocument.deleteMany({});

    res.send({
      message: "File deleted successfully!",
    });
  } catch {
    res.status(500).send({
      message: "Error deleting file",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
