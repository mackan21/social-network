import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
const router = Router();

router.get("/all", async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userId = decoded.userId;

    const allUsersResult = await pool.query(
      `
  SELECT 
    users.id, 
    users.username,
    users.created_at,
    EXISTS (
      SELECT 1 FROM follows WHERE follower_id = $1 AND followed_id = users.id
    ) AS "isFollowing"
  FROM users
  WHERE users.id != $1
  ORDER BY users.username ASC
  `,
      [userId]
    );

    res.status(200).json(allUsersResult.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
