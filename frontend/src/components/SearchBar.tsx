import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SearchBar.css";

type User = {
  id: number;
  username: string;
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      const fetchResults = async () => {
        setLoading(true);
        setError("");

        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            `http://localhost:3000/api/search?query=${query}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();

          if (!res.ok) {
            setError(data.error || "Something went wrong");
            setResults([]);
          } else {
            setResults(data);
          }
        } catch (err) {
          console.error("Search error:", err);
          setError("Server error while searching");
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    });

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {results.length > 0 && (
        <ul className="results-list">
          {results.map((user) => (
            <li key={user.username}>
              <Link
                to={`/users/${user.username}`}
                className="search-result-link"
              >
                <strong>@{user.username}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
