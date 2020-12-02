import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Nav = (props) => {
  const { auth } = useContext(AuthContext)
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
            {props.postsLength} posts
          </span>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
