import express from "express";
import cors from "cors";
import { pool } from "./config/db";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Databasen fungerar!", result: result.rows });
  } catch (err) {
    console.error("Databasfel:", err);
    res.status(500).json({ error: "kunde inte ansluta till databasen" });
  }
});

app.listen(PORT, () => {
  console.log(`Servern lyssnar på http://localhost:${PORT}`);
});
