import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Posts = () => {
  const [posts, setPosts] =  useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      let { posts, current_user: currentUser } = await response.json();
      setPosts(posts);
      if (currentUser) {
        setAuthenticated(true)
      } else {
        setAuthenticated(false)
      }
    };
    fetchPosts();
  }, [authenticated]);

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

  const togglePreview = (e) => {
    e.preventDefault()
    setPreview((state) => !state)
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

  const createTitle = (body) => {
    let title = body.split("\n")[0]
    const titleLen = title.split(" ").length
    if (titleLen > 8) {
      const regex = /^(?:\S+\s+?){1,8}/
      title = title.match(regex)
    }
    return title
  }

  return (
    posts && (
      <>
        {((!authenticated || preview) && (
          <div style={{ border: "2px solid black", padding: "10px"}}>
            <p>Hi, I'm Harrison. I currently work at <a href="https://coderacademy.edu.au/">CoderAcademy</a> where I've mentored around 100 students leading classes and assisting with content development. Here are my current <Link to="/projects">projects</Link>.</p>
          </div>
        ))}
        <div>
          {(authenticated && !preview) && (
              <>
                <Link to="/"><button style={{width: "100px", height: "40px", marginRight: "10px"}}>Write</button></Link>
                <Link to="/posts"><button style={{width: "100px", height: "40px"}} onClick={togglePreview}>Preview</button></Link>
              </>
            )
          }
          {posts.map((post, index) => {
            if ((authenticated && !preview) || post.public) {            
              return (
                <div key={index}>
                  <h3>
                    <Link to={`/posts/${post.id}`}>
                      {createTitle(post.body)}
                    </Link>
                  </h3>
                  <p>{moment(post.created_at).format("MMMM Do YYYY, h:mm:ss a")}</p>
                  {(authenticated && !preview) && (
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
      </>
    )
  );
};

export default Posts;
