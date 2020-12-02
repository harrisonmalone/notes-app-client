import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";
import { getAuthStatus } from "../utils/getAuthStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faLockOpen,
  faTrashAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const Posts = ({ setPostsLength }) => {
  const { auth, setAuth, loading } = useContext(AuthContext);
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    getAuthStatus(loading, setAuth);
  }, [setAuth, loading]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let { posts } = await response.json();
      setPosts(posts);
    };
    fetchPosts();
  }, []);

  const togglePrivacy = async (e, post) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        post: { body: post.body, public: !post.public },
      }),
    });
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const { posts } = await response.json();
    setPosts(posts);
  };

  const renderPrivacy = (bool) => {
    return bool ? (
      <FontAwesomeIcon icon={faLockOpen} />
    ) : (
      <FontAwesomeIcon icon={faLock} />
    );
  };

  const onDeleteLinkClick = async (e, id) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const { posts: updatedPosts } = await response.json();
    setPosts(updatedPosts);
  };

  const createTitle = (body) => {
    let title = body.split("\n")[0];
    const titleLen = title.split(" ").length;
    if (titleLen > 8) {
      const regex = /^(?:\S+\s+?){1,8}/;
      title = title.match(regex)[0].trim() + "...";
    }
    return title;
  };

  return (
    posts && (
      <div>
        {posts.map((post, index) => {
          if (auth || post.public) {
            return (
              <div key={index}>
                <h3 style={{ margin: "0px" }}>
                  <Link to={`/posts/${post.id}`}>{createTitle(post.body)}</Link>
                </h3>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p style={{ margin: "0px" }}>
                    {moment(post.created_at).format("MM/D/YY, HH:mm")}
                  </p>
                  {auth && (
                    <div className="action-icons">
                      <Link
                        to="/"
                        className="post-links"
                        onClick={(e) => togglePrivacy(e, post)}
                        style={post.public ? {} : { opacity: 0.7 }}
                      >
                        {renderPrivacy(post.public)}
                      </Link>
                      <Link
                        to={`/posts/${post.id}/edit`}
                        className="post-links"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <Link
                        to={`/posts`}
                        className="post-links"
                        onClick={(e) => onDeleteLinkClick(e, post.id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Link>
                    </div>
                  )}
                </div>
                <hr />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    )
  );
};

export default Posts;
