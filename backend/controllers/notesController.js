const Note = require("../models/Note");

// @desc    Get all notes for logged-in user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const { search, category, isFavorite, isArchived, sortBy } = req.query;
    console.log("Fetching notes with query:", req.query);

    // Build query
    let query = { userId: req.user.id };

    // Search in title and content
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by favorite
    if (isFavorite !== undefined) {
      query.isFavorite = isFavorite === "true";
    } // Filter by archived (Only apply if present)

    if (isArchived !== undefined) {
      query.isArchived = isArchived === "true";
    } else {
      query.isArchived = false;
    }
    
    // Build sort
    let sort = {};
    if (sortBy === "oldest") {
      sort.createdAt = 1;
    } else if (sortBy === "updated") {
      sort.updatedAt = -1;
    } else if (sortBy === "title") {
      sort.title = 1;
    } else {
      sort.createdAt = -1; // Default: newest first
    }

    const notes = await Note.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notes",
    });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if note belongs to user
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this note",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching note",
    });
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    console.log("Creating note with data:", req.body);
    const note = await Note.create({
      title,
      content,
      category: category || "Personal",
      tags: tags || [],
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating note",
    });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if note belongs to user
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this note",
      });
    }

    // Update note
    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating note",
    });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if note belongs to user
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this note",
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting note",
    });
  }
};

// @desc    Toggle favorite status
// @route   PUT /api/notes/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if note belongs to user
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this note",
      });
    }

    note.isFavorite = !note.isFavorite;
    await note.save();

    res.status(200).json({
      success: true,
      message: `Note ${
        note.isFavorite ? "added to" : "removed from"
      } favorites`,
      note,
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating note",
    });
  }
};

// @desc    Toggle archive status
// @route   PUT /api/notes/:id/archive
// @access  Private
const toggleArchive = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if note belongs to user
    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this note",
      });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.status(200).json({
      success: true,
      message: `Note ${note.isArchived ? "archived" : "unarchived"}`,
      note,
    });
  } catch (error) {
    console.error("Toggle archive error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating note",
    });
  }
};

// @desc    Get notes statistics
// @route   GET /api/notes/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalNotes = await Note.countDocuments({ userId, isArchived: false });
    const favoriteNotes = await Note.countDocuments({
      userId,
      isFavorite: true,
      isArchived: false,
    });
    const archivedNotes = await Note.countDocuments({
      userId,
      isArchived: true,
    });

    // Notes created this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const notesThisWeek = await Note.countDocuments({
      userId,
      createdAt: { $gte: oneWeekAgo },
    });

    // Notes by category
    const notesByCategory = await Note.aggregate([
      { $match: { userId: req.user._id, isArchived: false } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalNotes,
        favoriteNotes,
        archivedNotes,
        notesThisWeek,
        notesByCategory,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
    });
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  toggleFavorite,
  toggleArchive,
  getStats,
};
