import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { PostsContext } from "../context/PostsContext";

const Posts = () => {
  const { posts, setPostLength, postLength } = useContext(PostsContext);
  const [publicPosts, setPublicPosts] = useState(null);
  const [previewPostLength, setPreviewPostLength] = useState(null);
  const [unmounting, setUnmounting] = useState(false);
  const contextPostsLength = posts?.length;

  useEffect(() => {
    const fetchPosts = async () => {
      if (postLength !== previewPostLength) {
        if (posts) {
          let publicPosts = posts.filter((post) => post.public);
          let postLength = publicPosts.length;
          setPostLength(postLength);
          setPreviewPostLength(postLength);
          setPublicPosts(publicPosts);
        }
      }
    };
    fetchPosts();
  }, [posts, setPostLength, previewPostLength, postLength]);

  useEffect(() => {
    return () => {
      setUnmounting(true);
      if (unmounting) {
        setPostLength(contextPostsLength);
        setUnmounting(false);
      }
    };
  }, [contextPostsLength, unmounting, setPostLength]);

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
    publicPosts && (
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
          {publicPosts.map((post, index) => {
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
                </div>
                <hr />
              </div>
            );
          })}
        </div>
      </>
    )
  );
};

export default Posts;
