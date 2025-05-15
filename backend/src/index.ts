import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Servern lyssnar på http://localhost:${PORT}`);
});
