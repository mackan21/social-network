import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";
import "./FeedPage.css";
import "./ExplorePage.css";

type User = {
  id: number;
  username: string;
  createdAt: string;
  followers: number;
  following: number;
  isFollowing: boolean;
};

const ExplorePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [hoverStates, setHoverStates] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/api/testusers/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          alert(data.error || "Something went wrong");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleFollowToggle = async (
    userId: number,
    currentlyFollowing: boolean
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const url = `http://localhost:3000/api/users/${user.username}/${
      currentlyFollowing ? "unfollow" : "follow"
    }`;
    const method = currentlyFollowing ? "DELETE" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  isFollowing: !currentlyFollowing,
                  followers: u.followers + (currentlyFollowing ? -1 : 1),
                }
              : u
          )
        );
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="feed-page">
      <Navbar />
      <main>
        <div className="feed-group">
          <h2 className="explore-users">Explore Users</h2>
          <div className="user-list">
            {users.length === 0 ? (
              <p>Loading users...</p>
            ) : (
              users.map((user) => {
                const isHovering = hoverStates[user.id] || false;
                return (
                  <div
                    key={user.id}
                    className="post-wrapper user-item explore-user-wrapper"
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Link
                      to={`/users/${user.username}`}
                      className="explore-username"
                    >
                      @{user.username}
                    </Link>
                    <button
                      className="follow-button"
                      onClick={() =>
                        handleFollowToggle(user.id, user.isFollowing)
                      }
                      onMouseEnter={() =>
                        setHoverStates((prev) => ({ ...prev, [user.id]: true }))
                      }
                      onMouseLeave={() =>
                        setHoverStates((prev) => ({
                          ...prev,
                          [user.id]: false,
                        }))
                      }
                    >
                      <span
                        style={{ visibility: "hidden", position: "absolute" }}
                      >
                        Unfollow
                      </span>
                      <span>
                        {user.isFollowing
                          ? isHovering
                            ? "Unfollow"
                            : "Following"
                          : "Follow"}
                      </span>
                    </button>
                  </div>
                );
              })
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

export default ExplorePage;
