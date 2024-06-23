import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.SERVER_PORT || 8000;

app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.send({
    message: "Hello, world from server!!",
  });
});

app.post("/api/file", (req, res) => {
  console.log(req.body);
  res.send({
    message: "File received",
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
