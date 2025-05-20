import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Servern lyssnar på http://localhost:${PORT}`);
});
