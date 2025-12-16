import React from 'react';
import { useNotes } from '../../context/NotesContext';
import { 
  FaStickyNote, 
  FaStar, 
  FaArchive, 
  FaCalendarWeek,
  FaChartPie 
} from 'react-icons/fa';

const Stats = () => {
  const { stats } = useNotes();

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Notes',
      value: stats.totalNotes,
      icon: <FaStickyNote />,
      color: '#667eea'
    },
    {
      title: 'Favorites',
      value: stats.favoriteNotes,
      icon: <FaStar />,
      color: '#f59e0b'
    },
    {
      title: 'Archived',
      value: stats.archivedNotes,
      icon: <FaArchive />,
      color: '#8b5cf6'
    },
    {
      title: 'This Week',
      value: stats.notesThisWeek,
      icon: <FaCalendarWeek />,
      color: '#10b981'
    }
  ];

  return (
    <div className="stats-container">
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.notesByCategory && stats.notesByCategory.length > 0 && (
        <div className="category-stats">
          <h3><FaChartPie /> Notes by Category</h3>
          <div className="category-bars">
            {stats.notesByCategory.map((cat, index) => (
              <div key={index} className="category-bar-item">
                <div className="category-bar-label">
                  <span>{cat._id || 'Uncategorized'}</span>
                  <span className="category-bar-count">{cat.count}</span>
                </div>
                <div className="category-bar-bg">
                  <div 
                    className="category-bar-fill"
                    style={{ 
                      width: `${(cat.count / stats.totalNotes) * 100}%`,
                      backgroundColor: '#667eea'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;