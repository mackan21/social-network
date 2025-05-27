import { useEffect, useState } from "react";
import "./ProfilePage.css";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";

type Post = {
  id: number;
  content: string;
  created_at: string;
  username: string;
};

type UserProfile = {
  id: number;
  username: string;
  createdAt: string;
  followers: number;
  following: number;
};

const ProfilePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");

  const fetchMyPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/api/posts/my-posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
      setError("Could not retrieve your posts.");
    }
  };

  const fetchMyInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUserInfo(data);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Could not retrieve user data:", err);
    }
  };

  useEffect(() => {
    fetchMyPosts();
    fetchMyInfo();
  }, []);

  return (
    <div className="feed-page">
      <Navbar />
      <main>
        <div className="profile-section">
          {userInfo ? (
            <>
              <div>
                <h3>{userInfo.username}</h3>
                <p className="created-at">
                  Joined{" "}
                  {new Date(userInfo.createdAt).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="follower-following-count">
                  <p className="following-count">
                    {userInfo.following} Following
                  </p>
                  <p className="followers-count">
                    {userInfo.followers} Followers
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p>Loading user information...</p>
          )}
        </div>

        <div className="feed-group">
          <h3 className="my-posts">My posts</h3>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="feed-section">
            {posts.length === 0 ? (
              <p>You haven't made any posts yet.</p>
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

export default ProfilePage;
