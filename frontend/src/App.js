import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      await axios.post(API_URL, { title, content });
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
    setLoading(false);
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>📝 My Awesome Notes App - CI/CD Works! 🚀</h1>
        
        <form onSubmit={addNote} className="note-form">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="4"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Note'}
          </button>
        </form>

        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="no-notes">No notes yet. Create your first note!</p>
          ) : (
            notes.map(note => (
              <div key={note._id} className="note-card">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <div className="note-footer">
                  <small>{new Date(note.createdAt).toLocaleString()}</small>
                  <button 
                    onClick={() => deleteNote(note._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;