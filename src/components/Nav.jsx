import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PostsContext } from "../context/PostsContext";

const Nav = () => {
  const { auth } = useContext(AuthContext);
  const { postLength } = useContext(PostsContext);

  return (
    <nav>
      <h1>
        <Link to="/posts">Notes</Link>
      </h1>
      <div className="nav-action-links">
        {auth && (
          <>
            <Link to="/">Write</Link>
            <Link to="/preview">Preview</Link>
          </>
        )}
        <span>{postLength} posts</span>
      </div>
    </nav>
  );
};

export default Nav;
