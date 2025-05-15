import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import bcrypt from "bcrypt";

const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "Alla fält måste fyllas i" });
    return;
  }

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      res.status(400).json({ error: "Användare finns redan" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "Användare skapad!" });
  } catch (err) {
    console.error("Fel vid registrering:", err);
    res.status(500).json({ error: "Något gick fel på servern" });
  }
});

export default router;
