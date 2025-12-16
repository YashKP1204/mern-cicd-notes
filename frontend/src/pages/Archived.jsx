import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import NoteCard from '../components/notes/NoteCard';
import NoteModal from '../components/notes/NoteModal';
import { FaArchive } from 'react-icons/fa';

const Archived = () => {
  const { 
    notes,
    loading,
    deleteNote,
    toggleFavorite,
    toggleArchive,
    updateFilters
  } = useNotes();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    updateFilters({ isArchived: true });
    
    return () => {
      updateFilters({ isArchived: false });
    };
  }, []);

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setModalOpen(true);
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this note?')) {
      await deleteNote(id);
    }
  };

  return (
    <div className="app-container">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1><FaArchive /> Archived Notes</h1>
            <p>Notes you've archived</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading archived notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2>No archived notes</h2>
            <p>Archive notes you want to keep but don't need to see regularly.</p>
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
        mode="edit"
      />
    </div>
  );
};

export default Archived;