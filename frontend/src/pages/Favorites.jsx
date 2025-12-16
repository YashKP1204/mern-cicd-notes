import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import NoteCard from '../components/notes/NoteCard';
import NoteModal from '../components/notes/NoteModal';
import { FaStar } from 'react-icons/fa';

const Favorites = () => {
  const {
    notes,
    loading,
    deleteNote,
    toggleFavorite,
    toggleArchive,
    updateFilters,
  } = useNotes();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    // 1. ON MOUNT: Set filters to show Favorites view
    updateFilters({
      isFavorite: true,
      isArchived: false,
      category: "all",
      search: "",
    }); // 2. ON UNMOUNT (Cleanup): Explicitly reset to a default "All Notes" view
    return () => {
      updateFilters({
        isFavorite: false,
        isArchived: false,
        category: "all",
        search: "",
      });
    };
  }, [updateFilters]); // Include updateFilters in dependency array for best practice

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setModalOpen(true);
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
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
            <h1>
              <FaStar className="favorite-active" /> Favorite Notes
            </h1>
            <p>Your starred notes</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading favorites...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⭐</div>
            <h2>No favorite notes</h2>
            <p>Star your important notes to find them here quickly!</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
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

export default Favorites;