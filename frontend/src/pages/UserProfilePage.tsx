import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProfilePage.css";
import Navbar from "../components/Navbar";

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

const UserProfilePage = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !username) return;

    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUserInfo(data.user);
          setPosts(data.posts);
        } else {
          setError(data.error || "Något gick fel");
        }
      } catch (err) {
        console.error("Fel vid hämtning av profil:", err);
        setError("Serverfel");
      }
    };

    fetchUserInfo();
  }, [username]);

  return (
    <div className="feed-page">
      <Navbar />
      <main>
        <div className="profile-section">
          {userInfo ? (
            <>
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
            </>
          ) : (
            <p>Laddar användare...</p>
          )}
        </div>

        <div className="feed-group">
          <h3 className="my-posts">Posts</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="feed-section">
            {posts.length === 0 ? (
              <p>Inga inlägg ännu.</p>
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
    </div>
  );
};

export default UserProfilePage;
