import { Link } from "react-router-dom";

function Home() {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "#f8fafc",
    padding: "2rem"
  };

  const contentStyle = {
    textAlign: "center",
    maxWidth: "600px"
  };

  const titleStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#f980ff",
    marginBottom: "1rem"
  };

  const descriptionStyle = {
    fontSize: "1.25rem",
    color: "#475569",
    marginBottom: "2rem",
    lineHeight: "1.6"
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap"
  };

  const buttonStyle = {
    padding: "0.75rem 2rem",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    textDecoration: "none",
    color: "white",
    backgroundColor: "#ff59cd",
    transition: "background-color 0.3s ease"
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ff96fd"
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Welcome to SkillMesh</h1>
        <p style={descriptionStyle}>Find teammates based on skills</p>
        <div style={buttonContainerStyle}>
          <Link to="/login" style={buttonStyle}>
            Login
          </Link>
          <Link to="/register" style={secondaryButtonStyle}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;