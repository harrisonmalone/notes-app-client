import { useState, useEffect } from "react";
import keyboardjs from "keyboardjs";

const EditPost = (props) => {
  const [saved, setSaved] = useState(true);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(null)
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
      setLoading(true)
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
