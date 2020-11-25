import { useState, useEffect } from "react";
import showdown from "showdown";
import moment from "moment";

const Post = (props) => {
  const [post, setPost] = useState(null);
  const [html, setHtml] = useState("");
  const id = props.match.params.id;

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

  return (
    post && (
      <div>
        <span style={{fontSize: "large", color:"#717369"}}>{moment(post.created_at).format("MMMM Do YYYY, h:mm:ss a")}</span>
        <div dangerouslySetInnerHTML={createMarkup()}></div>
      </div>
    )
  );
};

export default Post;
