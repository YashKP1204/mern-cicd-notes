import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { useNotes } from '../../context/NotesContext';

const NoteModal = ({ isOpen, onClose, note, mode = 'create' }) => {
  const { createNote, updateNote, categories } = useNotes();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Personal',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (note && mode === 'edit') {
      setFormData({
        title: note.title,
        content: note.content,
        category: note.category || 'Personal',
        tags: note.tags || []
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'Personal',
        tags: []
      });
    }
  }, [note, mode, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'edit') {
        await updateNote(note._id, formData);
      } else {
        await createNote(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit Note' : 'Create New Note'}</h2>
          <button className="icon-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="note-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter note title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              placeholder="Write your note here..."
              value={formData.content}
              onChange={handleChange}
              required
              rows="8"
              maxLength="5000"
            />
            <small>{formData.content.length}/5000 characters</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Ideas">Ideas</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <div className="tag-input-container">
                <input
                  type="text"
                  id="tags"
                  placeholder="Add tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag(e);
                    }
                  }}
                />
                <button 
                  type="button" 
                  onClick={handleAddTag}
                  className="btn-add-tag"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="remove-tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span> Saving...
                </>
              ) : (
                <>
                  <FaSave /> {mode === 'edit' ? 'Update' : 'Create'} Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;