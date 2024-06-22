import express from "express";

const app = express();
const PORT = process.env.SERVER_PORT || 8000;

app.get("/api", (req, res) => {
  res.send({
    message: "Hello, world from serverr!!!",
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
