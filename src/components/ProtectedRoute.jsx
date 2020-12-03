import React, { useEffect, useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAuthStatus } from "../utils/getAuthStatus";
import { PostsContext } from "../context/PostsContext";

const ProtectedRoute = (props) => {
  const { auth, loading, setAuth } = useContext(AuthContext);
  const { setPosts, setPostLength, postLength } = useContext(PostsContext);

  useEffect(() => {
    getAuthStatus(loading, setAuth);
  }, [setAuth, loading]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (auth && !postLength) {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/posts`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        let { posts: fetchedPosts } = await response.json();
        let postLength = fetchedPosts.length;
        if (!auth) {
          let publicPosts = fetchedPosts.filter((post) => post.public);
          postLength = publicPosts.length;
        }
        setPostLength(postLength);
        setPosts(fetchedPosts);
      }
    };
    fetchPosts();
  }, [auth, setPostLength, postLength, setPosts]);

  if (!loading && !auth) {
    return <Redirect to="/posts" />;
  } else {
    return (
      !loading && (
        <Route
          exact={props.exact}
          path={props.path}
          component={props.component}
        />
      )
    );
  }
};

export default ProtectedRoute;
