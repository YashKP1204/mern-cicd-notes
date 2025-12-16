import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import NoteCard from '../components/notes/NoteCard';
import NoteModal from '../components/notes/NoteModal';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import Stats from '../components/dashboard/Stats';
import { FaPlus } from 'react-icons/fa';

const Dashboard = () => {
  const { 
    notes, 
    loading, 
    filters,
    categories,
    deleteNote, 
    toggleFavorite, 
    toggleArchive,
    updateFilters,
    fetchNotes
  } = useNotes();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  const handleCreateNote = () => {
    setSelectedNote(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
    }
  };

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  return (
    <div className="app-container">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>All Notes</h1>
            <p>Manage and organize your notes</p>
          </div>
          <button className="btn-primary btn-create" onClick={handleCreateNote}>
            <FaPlus /> Create Note
          </button>
        </div>

        <Stats />

        <div className="notes-controls">
          <SearchBar onSearch={handleSearch} />
          <FilterBar 
            filters={filters} 
            onFilterChange={handleFilterChange}
            categories={categories}
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No notes yet</h2>
            <p>Create your first note to get started!</p>
            <button className="btn-primary" onClick={handleCreateNote}>
              <FaPlus /> Create Your First Note
            </button>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onToggleFavorite={toggleFavorite}
                onToggleArchive={toggleArchive}
              />
            ))}
          </div>
        )}
      </main>

      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        note={selectedNote}
        mode={modalMode}
      />
    </div>
  );
};

export default Dashboard;