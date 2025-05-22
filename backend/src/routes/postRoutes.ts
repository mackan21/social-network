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
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ error: "Content is required" });
      return;
    }

    await pool.query("INSERT INTO posts (user_id, content) VALUES ($1, $2)", [
      decoded.userId,
      content,
    ]);

    res.status(201).json({ message: "Post created!" });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

router.get("/feed", async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token found" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userId = decoded.userId;

    const postsResult = await pool.query(
      `
    SELECT posts.id, posts.content, posts.created_at, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.user_id = $1
     OR posts.user_id IN (
       SELECT followed_id FROM follows WHERE follower_id = $1
     )
    ORDER BY posts.created_at DESC
    `,
      [userId]
    );

    res.status(200).json(postsResult.rows);
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/my-posts", async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token found" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const result = await pool.query(
      `
      SELECT posts.id, posts.content, posts.created_at, users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE users.id = $1
      ORDER BY posts.created_at DESC
      `,
      [decoded.userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching user's posts:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
