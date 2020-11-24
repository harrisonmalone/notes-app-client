import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Posts = () => {
  const [posts, setPosts] =  useState(null)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const { posts, current_user: currentUser } = await response.json();
      setPosts(posts);
      if (currentUser) {
        setAuthenticated(true)
      } else {
        setAuthenticated(false)
      }
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
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const { posts } = await response.json();
    setPosts(posts);
  }

  const renderPrivacy = (bool) => {
    return bool ? "Public" : "Private"
  }

  const logout = (e) => {
    e.preventDefault()
    localStorage.removeItem("token")
    window.location.reload()
  }

  const onDeleteLinkClick = async (e, id) => {
    e.preventDefault()
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    const { posts: updatedPosts } = await response.json();
    setPosts(updatedPosts);
  }

  return (
    posts && (
      <div>
        {authenticated && (
            <>
              <Link to="/"><button style={{width: "100px", height: "40px", marginRight: "10px"}}>Write</button></Link>
              <Link to="/posts"><button style={{width: "100px", height: "40px"}} onClick={logout}>Logout</button></Link>
            </>
          )
        }
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
