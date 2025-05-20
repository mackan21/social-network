import React, { useState } from "react";

const FeedPage = () => {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setMessage("Post published!");
        setContent("");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to the server");
    }
  };

  return (
    <div className="feed-page">
      <h2>Välkommen till din feed</h2>

      {/* Posta nytt inlägg */}
      <form onSubmit={handlePostSubmit}>
        <textarea
          placeholder="Vad vill du dela?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
        <br />
        <button type="submit">Publicera</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Här kommer sen visas andras inlägg */}
    </div>
  );
};

export default FeedPage;
