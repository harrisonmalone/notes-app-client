import React, { lazy, Component, Suspense } from "react";
import { importMDX } from "mdx.macro";
import moment from "moment";

const Content = lazy(() => importMDX("../markup/Projects.mdx"));

const Projects = (props) => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Content />
      </Suspense>
    </div>
  );
};

export default Projects;
