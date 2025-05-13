import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Välkommen till servern");
});

app.listen(PORT, () => {
  console.log(`Servern lyssnar på http://localhost:${PORT}`);
});
