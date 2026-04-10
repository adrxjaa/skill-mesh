
import { Link } from "react-router-dom";

function Navbar() {
  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    backgroundColor: "#0f172a",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderBottom: "2px solid #3b82f6"
  };

  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#3b82f6",
    margin: 0,
    textDecoration: "none"
  };

  const linksContainerStyle = {
    display: "flex",
    gap: "2rem",
    alignItems: "center"
  };

  const linkStyle = {
    color: "#e5e7eb",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "color 0.3s ease",
    cursor: "pointer"
  };

  const linkHoverStyle = {
    ...linkStyle,
    color: "#3b82f6"
  };

  return (
    <nav style={navStyle}>
      <h2 style={logoStyle}>SkillMesh</h2>
      <div style={linksContainerStyle}>
        <Link to="/" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#3b82f6"} onMouseLeave={(e) => e.target.style.color = "#e5e7eb"}>
          Home
        </Link>
        <Link to="/login" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#3b82f6"} onMouseLeave={(e) => e.target.style.color = "#e5e7eb"}>
          Login
        </Link>
        <Link to="/register" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#3b82f6"} onMouseLeave={(e) => e.target.style.color = "#e5e7eb"}>
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;