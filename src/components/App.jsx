import { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import NewPost from "./NewPost";
import Posts from "./Posts";
import Post from "./Post";
import ProtectedRoute from './ProtectedRoute';
import Login from "./Login";
import Container from "../templates/Container";
import EditPost from './EditPost'

const App = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuthenticated = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/status`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        setAuthenticated(true)
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    fetchAuthenticated()
  }, [])

  return !loading && (
    <Container>
      <h1>
        <Link to="/posts">🍉</Link>
      </h1>
      <Switch>
        <ProtectedRoute path="/" exact component={NewPost} />
        <Route path="/login" exact component={Login} />
        <Route path="/posts" exact render={(props) => {
          return <Posts {...props} authenticated={authenticated} />
        }} />
        <Route path="/posts/:id" exact component={Post} />
        <Route path="/posts/:id/edit" exact component={EditPost} />
      </Switch>
    </Container>
    )
};

export default App;
