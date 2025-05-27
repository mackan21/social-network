import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  isFollowing: boolean;
};

const UserProfilePage = () => {
  const { username } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token || !username) return;

    const url = `http://localhost:3000/api/users/${username}/${
      isFollowing ? "unfollow" : "follow"
    }`;
    const method = isFollowing ? "DELETE" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setUserInfo((prev) =>
          prev
            ? {
                ...prev,
                followers: prev.followers + (isFollowing ? -1 : 1),
              }
            : prev
        );
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error when following/unfollowing:", err);
      alert("Server error");
    }
  };

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
          setIsFollowing(data.user.isFollowing);
        } else {
          setError(data.error || "Something went wrong");
        }
      } catch (err) {
        console.error("Error retrieving profile:", err);
        setError("Server error");
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
              <div className="profile-info">
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
              <div className="profile-action">
                <button
                  onClick={handleFollowToggle}
                  className="follow-button"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <span style={{ visibility: "hidden", position: "absolute" }}>
                    Unfollow
                  </span>
                  <span>
                    {isFollowing
                      ? isHovering
                        ? "Unfollow"
                        : "Following"
                      : "Follow"}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <p>Loading user...</p>
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
      <div className="search-section">
        <SearchBar />
      </div>
    </div>
  );
};

export default UserProfilePage;
