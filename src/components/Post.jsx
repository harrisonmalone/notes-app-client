import { useState, useEffect, useContext } from "react";
import showdown from "showdown";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";
import { PostsContext } from "../context/PostsContext";
import { getAuthStatus } from "../utils/getAuthStatus";
import { Link, Redirect } from "react-router-dom";

const Post = (props) => {
  const [post, setPost] = useState(null);
  const [html, setHtml] = useState("");
  const { auth, setAuth, loading } = useContext(AuthContext);
  const { postLength, setPostLength } = useContext(PostsContext);
  const id = props.match.params.id;

  useEffect(() => {
    getAuthStatus(loading, setAuth);
  }, [setAuth, loading]);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${id}`
      );
      const post = await response.json();
      const converter = new showdown.Converter();
      const html = converter.makeHtml(post.body);
      setHtml(html);
      setPost(post);
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const getPostLength = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
      })
      let { post_length: fetchedPostLength } = await response.json()
      setPostLength(fetchedPostLength)
    }
    if (!postLength) {
      getPostLength()
    }
  }, [postLength, setPostLength])

  const createMarkup = () => {
    return { __html: html };
  };

  if (!post) {
    return null
  } else {
    if (!auth && !post.public) {
      return <Redirect to="/posts" />;
    } else {
      return (
        <div>
          <span style={{ fontSize: "large", color: "#717369" }}>
            {moment(post.created_at).format("MM/D/YY, HH:mm")}
          </span>
          {!loading && auth && (
            <Link to={`/posts/${id}/edit`} className="edit-and-show">
              <span>Edit</span>
            </Link>
          )}
          <div dangerouslySetInnerHTML={createMarkup()}></div>
        </div>
      )
    }
  }
};

export default Post;
