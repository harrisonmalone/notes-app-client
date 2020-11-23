import { useState } from "react";
import { useHistory } from 'react-router-dom'

const Login = () => {
  const [password, setPassword] = useState("");
  const history = useHistory()

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const body = { auth: { email: "h@gmail.com", password }}
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.status >= 400) {
        throw new Error("incorrect credentials");
      } else {
        const { jwt } = await response.json();
        localStorage.setItem("token", jwt);
        history.push("/");
      }
    } catch (err) {
      console.log(err.message)
    }
  };

  return (
    <>
      <h1>Login</h1>
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
