import React, { lazy, Suspense, useEffect, useContext } from "react";
import { importMDX } from "mdx.macro";
import { PostsContext } from "../context/PostsContext";

const Content = lazy(() => importMDX("../markup/Projects.mdx"));

const Projects = (props) => {
  const { postLength, setPostLength } = useContext(PostsContext);

  useEffect(() => {
    const getPostLength = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let { post_length: fetchedPostLength } = await response.json();
      setPostLength(fetchedPostLength);
    };
    if (!postLength) {
      getPostLength();
    }
  }, [postLength, setPostLength]);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Content />
      </Suspense>
    </div>
  );
};

export default Projects;
