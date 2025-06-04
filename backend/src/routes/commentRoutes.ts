import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

router.post("/create", async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token found" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const { postId, content } = req.body;

    if (!postId || !content) {
      res.status(400).json({ error: "postId and content are required" });
      return;
    }

    await pool.query(
      `INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3)`,
      [decoded.userId, postId, content]
    );

    res.status(201).json({ message: "Comment created" });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/post/:postId",
  async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    try {
      const result = await pool.query(
        `
        SELECT comments.id, comments.content, comments.created_at, users.username
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = $1
        ORDER BY comments.created_at ASC
        `,
        [postId]
      );

      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching comments:", err);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  }
);

export default router;
