import { useState, useEffect, useContext } from "react";
import showdown from "showdown";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";
import { getAuthStatus } from "../utils/getAuthStatus";
import { Link, Redirect } from "react-router-dom";

const Post = (props) => {
  const [post, setPost] = useState(null);
  const [html, setHtml] = useState("");
  const { auth, setAuth, loading } = useContext(AuthContext);
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
            {moment(post.created_at).format("MMMM Do YYYY, h:mm:ss a")}
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
