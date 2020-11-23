import { useState, useEffect } from "react";

const NewPost = () => {
  const [saved, setSaved] = useState(false);
  const [body, setBody] = useState("");
  const [created, setCreated] = useState(false);
  const [id, setId] = useState(null);
  const [command, setCommand] = useState(null);

  const createPost = async () => {
    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        post: { body },
      }),
    });
    const { id } = await response.json();
    setCreated(true);
    setId(id);
  };

  const editPost = async () => {
    await fetch(`http://localhost:3000/posts/${id}`, {
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

  const saveBtn = (e) => {
    e.preventDefault();
    if (created) {
      editPost();
    } else {
      createPost();
    }
    setSaved(true)
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
        if (created) {
          // if the post is already saved put request
          editPost();
        } else {
          // if the post is totally new post request
          // then add to state that post has been created, could potentially also change the url
          createPost();
        }
      }
      setCommand(false);
      setSaved(true);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", save);
    return () => {
      document.removeEventListener("keydown", save);
    };
  });

  const onPostChange = async (e) => {
    const body = e.target.value;
    setBody(body);
    setSaved(false);
  };

  return (
    <>
      <button onClick={saveBtn} className="save-btn">
        Save
      </button>
      <form>
        {!saved && <p><span className="unsaved">Unsaved</span></p>}
        <textarea
          autoFocus
          name="post"
          id="post"
          placeholder="Type something..."
          onChange={onPostChange}
          value={body}
        ></textarea>
      </form>
    </>
  );
};

export default NewPost;
