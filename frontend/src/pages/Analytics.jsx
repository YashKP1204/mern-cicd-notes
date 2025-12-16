import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { 
  FaChartBar, 
  FaStickyNote, 
  FaStar, 
  FaArchive,
  FaCalendarWeek,
  FaFolder
} from 'react-icons/fa';

const Analytics = () => {
  const { stats } = useNotes();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!stats) return null;

  const totalPercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  return (
    <div className="app-container">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1><FaChartBar /> Analytics</h1>
            <p>Insights about your notes</p>
          </div>
        </div>

        <div className="analytics-container">
          {/* Overview Stats */}
          <div className="analytics-section">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card large">
                <FaStickyNote className="stat-icon-large" style={{ color: '#667eea' }} />
                <h3>{stats.totalNotes}</h3>
                <p>Total Notes</p>
              </div>
              <div className="stat-card large">
                <FaStar className="stat-icon-large" style={{ color: '#f59e0b' }} />
                <h3>{stats.favoriteNotes}</h3>
                <p>Favorites</p>
                <small>{totalPercentage(stats.favoriteNotes, stats.totalNotes)}% of total</small>
              </div>
              <div className="stat-card large">
                <FaArchive className="stat-icon-large" style={{ color: '#8b5cf6' }} />
                <h3>{stats.archivedNotes}</h3>
                <p>Archived</p>
                <small>{totalPercentage(stats.archivedNotes, stats.totalNotes + stats.archivedNotes)}% of all</small>
              </div>
              <div className="stat-card large">
                <FaCalendarWeek className="stat-icon-large" style={{ color: '#10b981' }} />
                <h3>{stats.notesThisWeek}</h3>
                <p>This Week</p>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          {stats.notesByCategory && stats.notesByCategory.length > 0 && (
            <div className="analytics-section">
              <h2><FaFolder /> Category Distribution</h2>
              <div className="category-chart">
                {stats.notesByCategory.map((cat, index) => {
                  const percentage = totalPercentage(cat.count, stats.totalNotes);
                  const colors = ['#667eea', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];
                  const color = colors[index % colors.length];
                  
                  return (
                    <div key={index} className="category-chart-item">
                      <div className="category-chart-info">
                        <div className="category-chart-label">
                          <div 
                            className="category-color-dot"
                            style={{ backgroundColor: color }}
                          />
                          <span className="category-name">{cat._id || 'Uncategorized'}</span>
                        </div>
                        <div className="category-chart-stats">
                          <span className="category-count">{cat.count} notes</span>
                          <span className="category-percentage">{percentage}%</span>
                        </div>
                      </div>
                      <div className="category-progress-bar">
                        <div 
                          className="category-progress-fill"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Activity Summary */}
          <div className="analytics-section">
            <h2>Activity Summary</h2>
            <div className="activity-cards">
              <div className="activity-card">
                <h3>Most Productive</h3>
                <p className="activity-value">This Week</p>
                <small>{stats.notesThisWeek} notes created</small>
              </div>
              <div className="activity-card">
                <h3>Average per Category</h3>
                <p className="activity-value">
                  {stats.notesByCategory && stats.notesByCategory.length > 0
                    ? (stats.totalNotes / stats.notesByCategory.length).toFixed(1)
                    : 0}
                </p>
                <small>notes per category</small>
              </div>
              <div className="activity-card">
                <h3>Favorite Rate</h3>
                <p className="activity-value">
                  {totalPercentage(stats.favoriteNotes, stats.totalNotes)}%
                </p>
                <small>of notes are favorites</small>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;