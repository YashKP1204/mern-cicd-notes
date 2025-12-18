const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  toggleFavorite,
  toggleArchive,
  getStats,
} = require("../controllers/notesController");

// All routes are protected (require authentication)
router.use(protect);

// Stats route (must be before /:id routes)
router.get("/stats", getStats);

// CRUD routes
router.route("/").get(getNotes).post(createNote);

router.route("/:id").get(getNote).put(updateNote).delete(deleteNote);

// Special action routes
router.put("/:id/favorite", toggleFavorite);
router.put("/:id/archive", toggleArchive);

module.exports = router;
