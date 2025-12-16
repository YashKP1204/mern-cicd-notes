import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FaMoon, 
  FaSun, 
  FaSignOutAlt, 
  FaUser,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button 
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <Link to="/dashboard" className="navbar-brand">
          <h2>📝 NotesApp</h2>
        </Link>
      </div>

      <div className="navbar-right">
        <button 
          className="icon-btn"
          onClick={toggleDarkMode}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="user-menu">
          <div className="user-avatar">
            <img src={user?.avatar} alt={user?.name} />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>

        <button 
          className="btn-logout"
          onClick={logout}
          title="Logout"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;