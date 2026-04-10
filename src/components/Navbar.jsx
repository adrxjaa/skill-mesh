
import { Link } from "react-router-dom";

function Navbar() {
  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    backgroundColor: "#46052e",
    boxShadow: "0 2px 4px rgba(234, 13, 13, 0.1)",
    borderBottom: "2px solid #f18ed9"
  };

  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ff13a8",
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
    color: "#e646ff"
  };

  return (
    <nav style={navStyle}>
      <h2 style={logoStyle}>SkillMesh</h2>
      <div style={linksContainerStyle}>
        <Link to="/" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#f63bc1"} onMouseLeave={(e) => e.target.style.color = "#e5e7eb"}>
          Home
        </Link>
        <Link to="/login" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#f63bc1"} onMouseLeave={(e) => e.target.style.color = "#e5e7eb"}>
          Login
        </Link>
        <Link to="/register" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#f63bc1"} onMouseLeave={(e) => e.target.style.color = "#e5e7eb"}>
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;