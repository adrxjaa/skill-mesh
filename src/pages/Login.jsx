import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", { email, password });
  
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "#f8fafc",
    padding: "2rem"
  };

  const formContainerStyle = {
    backgroundColor: "white",
    padding: "2.5rem",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px"
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#0f172a",
    textAlign: "center"
  };

  const formGroupStyle = {
    marginBottom: "1.5rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#1e293b"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #cbd5e1",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease"
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#f63bc1",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
