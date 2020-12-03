import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import NewPost from "./NewPost";
import Posts from "./Posts";
import Post from "./Post";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Container from "../templates/Container";
import EditPost from "./EditPost";
import Projects from "./Projects";
import Nav from "./Nav";
import Preview from "./Preview";
import { AuthProvider } from "../context/AuthContext";
import { PostsProvider } from "../context/PostsContext";

const App = () => {
  return (
    <AuthProvider>
      <PostsProvider>
        <Container>
          <Nav />
          <Switch>
            <ProtectedRoute path="/" exact component={NewPost} />
            <ProtectedRoute path="/preview" exact component={Preview} />
            <Route path="/login" exact component={Login} />
            <Route path="/posts" exact component={Posts} />
            <Route path="/projects" exact component={Projects} />
            <Route path="/posts/:id" exact component={Post} />
            <ProtectedRoute path="/posts/:id/edit" exact component={EditPost} />
          </Switch>
        </Container>
      </PostsProvider>
    </AuthProvider>
  );
};

export default App;
