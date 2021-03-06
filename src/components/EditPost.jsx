import { useState, useEffect, useContext } from "react";
import keyboardjs from "keyboardjs";
import { Link } from "react-router-dom";
import moment from "moment";
import { PostsContext } from "../context/PostsContext";

const EditPost = (props) => {
  const [saved, setSaved] = useState(true);
  const [body, setBody] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(null);
  const { setPosts } = useContext(PostsContext);
  const id = props.match.params.id;

  const saveBtn = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaved(true);
  };

  useEffect(() => {
    const setBinding = () => {
      keyboardjs.bind("command + s", save);
    };
    setBinding();
  }, []);

  useEffect(() => {
    return () => {
      keyboardjs.unbind("command + s", save);
    };
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${id}`
      );
      const post = await response.json();
      setBody(post.body);
      setCreatedAt(post.created_at);
      setLoading(true);
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const editPost = async () => {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          post: { body },
        }),
      });
      const postsResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let { posts } = await postsResponse.json();
      setPosts(posts)
    };
    if (saved) {
      editPost();
    }
  });

  const onPostChange = async (e) => {
    const body = e.target.value;
    setBody(body);
    setSaved(false);
  };

  const style = { width: "100px", height: "50px", opacity: 0.1 };
  if (!saved) {
    style.opacity = 0.7;
  }
  return (
    loading && (
      <>
        <span style={{ fontSize: "large", color: "#717369" }}>
          {moment(createdAt).format("MM/D/YY, HH:mm")}
        </span>
        <Link to={`/posts/${id}`} className="edit-and-show">
          <span>Show</span>
        </Link>
        <form className="new-post-form">
          <textarea
            autoFocus
            name="post"
            id="post"
            placeholder="Type something..."
            onChange={onPostChange}
            value={body}
          ></textarea>
        </form>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px 0px",
          }}
        >
          <button onClick={saveBtn} style={style}>
            Save
          </button>
        </div>
      </>
    )
  );
};

export default EditPost;
