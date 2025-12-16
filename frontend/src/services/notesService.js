import api from './api';

const notesService = {
  // Get all notes
  getNotes: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.isFavorite) params.append('isFavorite', 'true');
    if (filters.isArchived) params.append('isArchived', 'true');
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const response = await api.get(`/notes?${params.toString()}`);
    return response.data;
  },

  // Get single note
  getNote: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Create note
  createNote: async (noteData) => {
    console.log("api called from notesService");
    const response = await api.post('/notes', noteData);
    console.log("Response from createNote:", response);
    return response.data;
  },

  // Update note
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  // Delete note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    const response = await api.put(`/notes/${id}/favorite`);
    return response.data;
  },

  // Toggle archive
  toggleArchive: async (id) => {
    const response = await api.put(`/notes/${id}/archive`);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get('/notes/stats');
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  }
};

export default notesService;