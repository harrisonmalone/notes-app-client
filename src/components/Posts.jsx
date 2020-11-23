import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Posts = ({ authenticated }) => {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`);
      const posts = await response.json();
      console.log(posts)
      setPosts(posts);
    };
    fetchPosts();
  }, []);

  const togglePrivacy = async (e, post) => {
    e.preventDefault()
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        post: { body: post.body, public: !post.public },
      }),
    });
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`);
    const posts = await response.json();
    setPosts(posts);
  }

  const renderPrivacy = (bool) => {
    return bool ? "Public" : "Private"
  }

  const onDeleteLinkClick = async (e, id) => {
    e.preventDefault()
    const removedPost = posts.filter((post) => post.id !== id)
    setPosts(removedPost)
    fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });
  }

  return (
    posts && (
      <div>
        {authenticated && <Link to="/"><button style={{width: "100px", height: "40px"}}>Write</button></Link>}
        {posts.map((post, index) => {
          if (authenticated || post.public) {            
            return (
              <div key={index}>
                <h3>
                  <Link to={`/posts/${post.id}`}>
                    {post.body.substring(0, 15)}
                  </Link>
                </h3>
                <p>{moment(post.created_at).format("MMMM Do YYYY, h:mm:ss a")}</p>
                {authenticated && (
                  <>
                    <Link to="/" className="post-links" onClick={(e) => togglePrivacy(e, post)}>{renderPrivacy(post.public)}</Link>
                    <Link to={`/posts/${post.id}/edit`} className="post-links">Edit</Link>
                    <Link to={`/posts`} className="post-links" onClick={(e) => onDeleteLinkClick(e, post.id)}>Delete</Link>
                  </>
                )}
                <hr/>
              </div>
            );
          } else {
            return null
          }
        })}
      </div>
    )
  );
};

export default Posts;
