import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "All fields must be filled in." });
    return;
  }

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User created!" });
  } catch (err) {
    console.error("Fel vid registrering:", err);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "All fields must be filled in." });
    return;
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      res.status(401).json({ error: "Wrong email or password" });
      return;
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(401).json({ error: "Wrong email or password" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful!",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error when logging in:", err);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

router.get("/me", async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userId = decoded.userId;

    const userResult = await pool.query(
      `SELECT id, username, created_at FROM users WHERE id = $1`,
      [userId]
    );

    const followerCountResult = await pool.query(
      `SELECT COUNT(*) FROM follows WHERE followed_id = $1`,
      [userId]
    );

    const followingCountResult = await pool.query(
      `SELECT COUNT(*) FROM follows WHERE follower_id = $1`,
      [userId]
    );

    res.status(200).json({
      id: userResult.rows[0].id,
      username: userResult.rows[0].username,
      createdAt: userResult.rows[0].created_at,
      followers: parseInt(followerCountResult.rows[0].count),
      following: parseInt(followingCountResult.rows[0].count),
    });
  } catch (err) {
    console.error("Error getting user info", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/search", async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userId = decoded.userId;

    const query = req.query.query as string;

    if (!query) {
      res.status(400).json({ error: "Missing search query" });
      return;
    }

    const results = await pool.query(
      "SELECT id, username FROM users WHERE username ILIKE $1 AND id != $2 LIMIT 10",
      [`%${query}%`, userId]
    );

    res.status(200).json(results.rows);
  } catch (err) {
    console.error("Error during user search:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:username", async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const loggedInUserId = decoded.userId;
    const { username } = req.params;

    const userResult = await pool.query(
      `SELECT id, username, created_at FROM users WHERE username = $1`,
      [username]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = userResult.rows[0];

    const followerCountResult = await pool.query(
      `SELECT COUNT(*) FROM follows WHERE followed_id = $1`,
      [user.id]
    );

    const followingCountResult = await pool.query(
      `SELECT COUNT(*) FROM follows WHERE follower_id = $1`,
      [user.id]
    );

    const postsResult = await pool.query(
      `SELECT posts.id, posts.content, posts.created_at, users.username
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.user_id = $1
       ORDER BY posts.created_at DESC`,
      [user.id]
    );

    const isFollowingResult = await pool.query(
      `SELECT * FROM follows WHERE follower_id = $1 AND followed_id = $2`,
      [loggedInUserId, user.id]
    );

    const isFollowing = isFollowingResult.rows.length > 0;

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.created_at,
        followers: parseInt(followerCountResult.rows[0].count),
        following: parseInt(followingCountResult.rows[0].count),
        isFollowing,
      },
      posts: postsResult.rows,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post(
  "/:username/follow",
  async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const followerId = decoded.userId;
      const { username } = req.params;

      const userResult = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
      );

      if (userResult.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const followedId = userResult.rows[0].id;

      if (followerId === followedId) {
        res.status(400).json({ error: "You cannot follow yourself" });
        return;
      }

      await pool.query(
        "INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [followerId, followedId]
      );

      res.status(200).json({ message: "Now following user" });
    } catch (err) {
      console.error("Error following user:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.delete(
  "/:username/unfollow",
  async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const followerId = decoded.userId;
      const { username } = req.params;

      const userResult = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
      );

      if (userResult.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const followedId = userResult.rows[0].id;

      await pool.query(
        "DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2",
        [followerId, followedId]
      );

      res.status(200).json({ message: "Unfollowed user" });
    } catch (err) {
      console.error("Error unfollowing user:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
