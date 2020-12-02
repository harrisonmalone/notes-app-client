import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Posts = () => {
  const [posts, setPosts] = useState(null);

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

  const createTitle = (body) => {
    let title = body.split("\n")[0];
    const titleLen = title.split(" ").length;
    if (titleLen > 4) {
      const regex = /^(?:\S+\s+?){1,4}/;
      title = title.match(regex)[0].trim() + "...";
    }
    return title;
  };

  return (
    posts && (
      <>
        <div
          className="profile"
          style={{
            border: "2px solid black",
            padding: "10px",
            margin: "10px 0px",
          }}
        >
          <p>
            Hi, I'm Harrison. I currently work at{" "}
            <a href="https://coderacademy.edu.au/">CoderAcademy</a> where I've
            mentored around 100 students leading classes and assisting with
            content development. Here are my current{" "}
            <Link to="/projects">projects</Link>.
          </p>
        </div>
        <div>
          {posts.map((post, index) => {
            if (post.public) {
              return (
                <div key={index}>
                  <h3 style={{ margin: "0px" }}>
                    <Link to={`/posts/${post.id}`}>
                      {createTitle(post.body)}
                    </Link>
                  </h3>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p style={{ margin: "0px" }}>
                      {moment(post.created_at).format("MM/D/YY, HH:mm")}
                    </p>
                  </div>
                  <hr />
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </>
    )
  );
};

export default Posts;
