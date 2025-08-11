const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const auth = require("../middleware/auth");
const logger = require("../utils/logger");

// GET all published public wellness sessions
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await Session.find({ status: "published" })
      .populate("user_id", "email")
      .sort({ created_at: -1 });
    res.json(sessions);
  } catch (error) {
    logger.error("Error fetching public sessions:", error);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

// GET one published public session by ID
router.get("/sessions/:id", async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      status: "published",
    }).populate("user_id", "email");
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  } catch (error) {
    logger.error(`Error fetching session ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to fetch session" });
  }
});

// GET logged-in user's sessions (draft + published)
router.get("/my-sessions", auth, async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user.id }).sort({
      created_at: -1,
    });
    res.json(sessions);
  } catch (error) {
    logger.error("Error fetching user sessions:", error);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

// Save or update a draft session
router.post("/my-sessions/save-draft", auth, async (req, res) => {
  let { id, title, description, duration, tags, content } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !duration || !content) {
      return res.status(400).json({ 
        message: "Title, description, duration and content are required" 
      });
    }

    // Convert comma-separated tags to array if needed
    if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    let session;
    if (id) {
      // Update existing draft
      session = await Session.findOneAndUpdate(
        { _id: id, user_id: req.user.id },
        { 
          title, 
          description, 
          duration, 
          tags, 
          content,
          status: "draft" 
        },
        { new: true, runValidators: true }
      );
      if (!session)
        return res.status(404).json({ message: "Session not found" });
    } else {
      // Create new draft
      session = new Session({
        user_id: req.user.id,
        title,
        description,
        duration,
        tags,
        content,
        status: "draft"
      });
      await session.save();
    }

    logger.info(`Draft saved for user ${req.user.id}`);
    res.json(session);
  } catch (error) {
    logger.error(`Error saving draft for user ${req.user.id}:`, error);
    res.status(500).json({ message: "Failed to save draft" });
  }
});

// Publish a session
router.post("/my-sessions/publish", auth, async (req, res) => {
  let { id, title, description, duration, tags, content } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !duration || !content) {
      return res.status(400).json({ 
        message: "Title, description, duration and content are required" 
      });
    }

    if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    let session;
    if (id) {
      // Update and publish existing draft
      session = await Session.findOneAndUpdate(
        { _id: id, user_id: req.user.id },
        { 
          title, 
          description, 
          duration,
          tags, 
          content,
          status: "published" 
        },
        { new: true, runValidators: true }
      );
      if (!session)
        return res.status(404).json({ message: "Session not found" });
    } else {
      // Create and publish a new session
      session = new Session({
        user_id: req.user.id,
        title,
        description,
        duration,
        tags,
        content,
        status: "published",
      });
      await session.save();
    }

    logger.info(
      `Session published by user ${req.user.id} with title: ${title}`
    );
    res.status(201).json(session);
  } catch (error) {
    logger.error(
      `Session publish failed for user ${req.user.id}: ${error.message}`
    );
    res.status(500).json({ message: "Failed to publish session" });
  }
});

// GET a single logged-in user's session
router.get("/my-sessions/:id", auth, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (error) {
    logger.error(`Error fetching session ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to fetch session" });
  }
});

// DELETE a logged-in user's session
router.delete("/my-sessions/:id", auth, async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });
    if (!session) return res.status(404).json({ message: "Session not found" });

    logger.info(`Session ${req.params.id} deleted by user ${req.user.id}`);
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting session ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to delete session" });
  }
});

module.exports = router;
