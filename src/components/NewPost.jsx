import { useState, useEffect } from "react";
import keyboardjs from "keyboardjs";

const NewPost = () => {
  const [saved, setSaved] = useState(false);
  const [body, setBody] = useState("");
  const [id, setId] = useState(null);

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
    const createPost = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            post: { body },
          }),
        }
      );
      const { id } = await response.json();
      setId(id);
    };

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

    if (saved && id) {
      editPost();
    } else if (saved) {
      createPost();
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
  );
};

export default NewPost;
