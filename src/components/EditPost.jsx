import { useState, useEffect } from "react";

const EditPost = (props) => {
  const [saved, setSaved] = useState(true);
  const [body, setBody] = useState("");
  const [command, setCommand] = useState(null);
  const id = props.match.params.id

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

  const save = (e) => {
    if (e.code === "MetaLeft") {
      setCommand(true);
      setTimeout(() => {
        setCommand(false);
      }, 1000);
    }
    if (e.code === "KeyS") {
      if (command) {
        e.preventDefault();
        editPost();
        setCommand(false);
        setSaved(true);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", save);
    return () => {
      document.removeEventListener("keydown", save);
    };
  });

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`);
      const post = await response.json();
      setBody(post.body);
    };
    fetchPost();
  }, [id]);

  const onPostChange = async (e) => {
    const body = e.target.value;
    setBody(body);
    setSaved(false);
  };

  return body && (
    <form>
      {!saved && <p>Unsaved</p>}
      <textarea
        autoFocus
        name="post"
        id="post"
        placeholder="Type something..."
        onChange={onPostChange}
        value={body}
      ></textarea>
    </form>
  );
};

export default EditPost;
