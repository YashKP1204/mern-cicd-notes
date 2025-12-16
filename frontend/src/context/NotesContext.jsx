import React, { createContext, useState, useContext, useEffect ,useCallback} from 'react';
import notesService from '../services/notesService';
import { toast } from 'react-toastify';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    isFavorite: false,
    isArchived: false,
    sortBy: "newest",
  });

  // Fetch notes
  const fetchNotes = useCallback(
    async (filterOverrides = {}) => {
      setLoading(true);
      try {
        // Ensure you are using the LATEST 'filters' state here
        const appliedFilters = { ...filters, ...filterOverrides };
        const data = await notesService.getNotes(appliedFilters);
        setNotes(data.notes);
      } catch (error) {
        toast.error("Failed to fetch notes");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await notesService.getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const data = await notesService.getStats();
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Create note
  const createNote = async (noteData) => {
    try {
      const data = await notesService.createNote(noteData);
      setNotes([data.note, ...notes]);
      toast.success("Note created successfully!");
      fetchStats(); // Update stats
      return data.note;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note");
      throw error;
    }
  };

  // Update note
  const updateNote = async (id, noteData) => {
    try {
      const data = await notesService.updateNote(id, noteData);
      setNotes(notes.map((note) => (note._id === id ? data.note : note)));
      toast.success("Note updated successfully!");
      return data.note;
    } catch (error) {
      toast.error("Failed to update note");
      throw error;
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await notesService.deleteNote(id);
      setNotes(notes.filter((note) => note._id !== id));
      toast.success("Note deleted successfully!");
      fetchStats(); // Update stats
    } catch (error) {
      toast.error("Failed to delete note");
      throw error;
    }
  };

  // Toggle favorite
  const toggleFavorite = async (id) => {
    try {
      const data = await notesService.toggleFavorite(id);
      setNotes(notes.map((note) => (note._id === id ? data.note : note)));
      toast.success(data.message);
      fetchStats(); // Assuming fetchStats is also stable/defined outside of here
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  // Toggle archive
  const toggleArchive = useCallback(
    async (id) => {
      try {
        const data = await notesService.toggleArchive(id);
        // This setNotes depends on the 'notes' state, so it must be in the dependency array
        setNotes(notes.filter((note) => note._id !== id));
        toast.success(data.message);
        fetchStats(); // Assuming fetchStats is also stable/defined outside of here
      } catch (error) {
        toast.error("Failed to update note");
      }
    },
    [notes]
  );

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  }, []);

  // Create category
  const createCategory = async (categoryData) => {
    try {
      const data = await notesService.createCategory(categoryData);
      setCategories([...categories, data.category]);
      toast.success("Category created successfully!");
      return data.category;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
      throw error;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchNotes(); // fetchNotes is now a stable function that only changes when 'filters' changes
  }, [fetchNotes]);

  const value = {
    notes,
    categories,
    stats,
    loading,
    filters,
    fetchNotes,
    fetchCategories,
    fetchStats,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    toggleArchive,
    updateFilters,
    createCategory,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};