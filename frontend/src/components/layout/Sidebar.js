import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNotes } from '../../context/NotesContext';
import { 
  FaHome, 
  FaStar, 
  FaArchive, 
  FaChartBar,
  FaFolder,
  FaPlus
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const { stats, categories } = useNotes();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-section">
          <h3>Main</h3>
          <NavLink to="/dashboard" className="sidebar-link" onClick={onClose}>
            <FaHome /> All Notes
            {stats && <span className="badge">{stats.totalNotes}</span>}
          </NavLink>
          
          <NavLink to="/favorites" className="sidebar-link" onClick={onClose}>
            <FaStar /> Favorites
            {stats && <span className="badge">{stats.favoriteNotes}</span>}
          </NavLink>
          
          <NavLink to="/archived" className="sidebar-link" onClick={onClose}>
            <FaArchive /> Archived
            {stats && <span className="badge">{stats.archivedNotes}</span>}
          </NavLink>

          <NavLink to="/analytics" className="sidebar-link" onClick={onClose}>
            <FaChartBar /> Analytics
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="section-header">
            <h3>Categories</h3>
            <NavLink to="/categories" className="icon-btn-small" title="Manage Categories">
              <FaPlus />
            </NavLink>
          </div>
          
          {categories.map(category => (
            <NavLink 
              key={category._id}
              to={`/category/${category.name}`}
              className="sidebar-link category-link"
              onClick={onClose}
            >
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;