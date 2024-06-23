import express from "express";
import bodyParser from "body-parser";
import db, { connectToDatabase } from "./config/db";

const app = express();
const PORT = process.env.SERVER_PORT || 8000;

app.use(bodyParser.json());

connectToDatabase();

app.get("/api", (req, res) => {
  res.send({
    message: "Hello, world from server!!",
  });
});

app.get("/api/files", async (req, res) => {
  try {
    const data = await db.pdfDocument.findMany();

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

app.post("/api/file", async (req, res) => {
  const { url, key } = req.body;

  if (!url || !key) {
    return res.status(400).send({
      message: "URL and key are required",
    });
  }

  try {
    const data = await db.pdfDocument.create({
      data: {
        name: key,
        url,
        parsedData: [],
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

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
