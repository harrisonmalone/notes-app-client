import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PostsContext } from "../context/PostsContext";

const Login = () => {
  const [password, setPassword] = useState("");
  const history = useHistory();
  const { setAuth } = useContext(AuthContext);
  const { posts, setPostLength } = useContext(PostsContext);
  const contextPostsLength = posts?.length;
  console.log(contextPostsLength)

  useEffect(() => {
    return () => {
      setPostLength(contextPostsLength);
    };
  }, [contextPostsLength, setPostLength]);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const body = { auth: { email: "h@gmail.com", password } };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (response.status >= 400) {
        throw new Error("incorrect credentials");
      } else {
        const { jwt } = await response.json();
        localStorage.setItem("token", jwt);
        setAuth({ auth: true, loading: false })
        history.push("/posts");
      }
    } catch (err) {}
  };

  return (
    <>
      <h3>Login</h3>
      <form className="login-form" onSubmit={onFormSubmit}>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="form-group">
          <input id="submit" type="submit" value="Sign in" />
        </div>
      </form>
    </>
  );
};

export default Login;
