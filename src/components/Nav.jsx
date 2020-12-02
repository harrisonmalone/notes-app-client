import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Nav = () => {
  const { auth } = useContext(AuthContext)
  const [postLength, setPostLength] = useState(null)

  useEffect(() => {
    const fetchPostLength = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/stats`
      );
      let { post_length: postLength } = await response.json();
      setPostLength(postLength);
    };
    fetchPostLength();
  }, []);

  return (
    <nav>
      <h1>
        <Link to="/posts" style={{ color: "black" }}>
          Notes
        </Link>
      </h1>
      <div className="nav-action-links">
        {auth && (
          <>
            <Link to="/">
              Write
            </Link>
            <Link to="/preview" >
              Preview
            </Link>
            <span>
              {postLength} posts
            </span>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
