import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import testUserRoutes from "./routes/testUserRoutes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/testusers", testUserRoutes);

app.listen(PORT, () => {
  console.log(`Servern lyssnar på http://localhost:${PORT}`);
});
