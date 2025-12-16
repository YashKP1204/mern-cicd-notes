import React from 'react';
import { 
  FaStar, 
  FaRegStar, 
  FaEdit, 
  FaTrash, 
  FaArchive,
  FaTag
} from 'react-icons/fa';

const NoteCard = ({ note, onEdit, onDelete, onToggleFavorite, onToggleArchive }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="note-card">
      <div className="note-card-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          <button 
            className="icon-btn"
            onClick={() => onToggleFavorite(note._id)}
            title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {note.isFavorite ? <FaStar className="favorite-active" /> : <FaRegStar />}
          </button>
          <button 
            className="icon-btn"
            onClick={() => onEdit(note)}
            title="Edit note"
          >
            <FaEdit />
          </button>
          <button 
            className="icon-btn"
            onClick={() => onToggleArchive(note._id)}
            title={note.isArchived ? 'Unarchive' : 'Archive'}
          >
            <FaArchive />
          </button>
          <button 
            className="icon-btn delete-btn"
            onClick={() => onDelete(note._id)}
            title="Delete note"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <p className="note-content">{note.content}</p>

      <div className="note-footer">
        <div className="note-meta">
          {note.category && (
            <span className="note-category">
              <FaTag /> {note.category}
            </span>
          )}
          {note.tags && note.tags.length > 0 && (
            <div className="note-tags">
              {note.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
        <span className="note-date">{formatDate(note.createdAt)}</span>
      </div>
    </div>
  );
};

export default NoteCard;