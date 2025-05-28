import React, { useState, useEffect } from "react";
import "./FeedPage.css";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const heartIcon = <FontAwesomeIcon icon={faHeart} />;

type Post = {
  id: number;
  content: string;
  created_at: string;
  username: string;
  like_count: number;
  liked_by_me: boolean;
};

const FeedPage = () => {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  const token = localStorage.getItem("token");

  const fetchFeed = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/api/posts/feed", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
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
        setContent("");
        fetchFeed();
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to the server");
    }
  };

  const toggleLike = async (postId: number, liked: boolean) => {
    try {
      const url = `http://localhost:3000/api/posts/like/${postId}`;
      const method = liked ? "DELETE" : "POST";

      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchFeed();
    } catch (err) {
      console.error("Error toggling like", err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="feed-page">
      <Navbar />
      <main>
        <div className="feed-group">
          <div className="start">
            <h2>Start Yapping!</h2>
          </div>
          <form className="post-form" onSubmit={handlePostSubmit}>
            <div className="post-profile"></div>
            <div className="post-area">
              <div className="post-text-area">
                <textarea
                  className="post-text"
                  placeholder="What's yappening?"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  rows={1}
                  required
                />
              </div>
              <div className="button-area">
                <button className="post-button" type="submit">
                  Post
                </button>
              </div>
            </div>
          </form>

          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="feed-section">
            <h4 className="following">Following</h4>
            {posts.length === 0 ? (
              <div className="welcome-group">
                <p className="welcome-text">Welcome to Yap!</p>
                <p className="welcome-text-2">
                  Start by following some people you know or that you like and
                  their posts will show up here in your feed.
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div className="post-wrapper" key={post.id}>
                  <div className="post-profile"></div>
                  <div className="post">
                    <div className="username-date">
                      <p className="username">
                        <strong>@{post.username}</strong>
                      </p>
                      <p className="date">
                        {new Date(post.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="content">
                      <p>{post.content}</p>
                    </div>
                    <div className="like-section">
                      <button
                        className={`like-button ${
                          post.liked_by_me ? "liked" : ""
                        }`}
                        onClick={() => toggleLike(post.id, post.liked_by_me)}
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                          className="heart-icon"
                          style={{
                            color: post.liked_by_me ? "red" : "white",
                          }}
                        />
                      </button>

                      <span className="like-count">{post.like_count}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <div className="search-section">
        <SearchBar />
      </div>
    </div>
  );
};

export default FeedPage;
