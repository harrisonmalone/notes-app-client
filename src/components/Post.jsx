import { useState, useEffect } from "react";
import showdown from "showdown";

const Post = (props) => {
  const [post, setPost] = useState(null)
  const id = props.match.params.id;

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`);
      const post = await response.json();
      const converter = new showdown.Converter();
      const html = converter.makeHtml(post.body);
      setPost(html)
    }
    fetchPost()
  }, [id])

  const createMarkup = () => {
    return { __html: post };
  };

  return post && <div dangerouslySetInnerHTML={createMarkup()}></div>;
}

export default Post;
