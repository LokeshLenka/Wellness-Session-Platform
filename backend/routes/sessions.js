const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const auth = require("../middleware/auth");
const logger = require("../utils/logger");

// get all published public wellness sessions
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' })
      .populate('user_id', 'email') // Only get user's name
      .sort({ created_at: -1 });
    res.json(sessions);
  } catch (error) {
    logger.error('Error fetching public sessions:', error);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

// get all public wellness sessions with specified id
router.get("/sessions/:id", async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, status: 'published' })
      .populate('user_id', 'email'); // Only get user's name
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  } catch (error) {
    logger.error(`Error fetching session ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to fetch session" });
  }
});

//get user’s own sessions (draft + published)
router.get("/my-sessions", auth, async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user.id })
      .sort({ created_at: -1 });
    res.json(sessions);
  } catch (error) {
    logger.error('Error fetching public sessions:', error);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

// Save or update a draft session
router.post("/my-sessions/save-draft", auth, async (req, res) => {
  const { id, title, tags, json_file_url } = req.body;
  
  try {
    let session;
    if (id) {
      // Update existing draft
      session = await Session.findOneAndUpdate(
        { _id: id, user_id: req.user.id },
        { 
          title,
          tags,
          json_file_url,
          status: 'draft'
        },
        { new: true, runValidators: true }
      );
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
    } else {
      // Create new draft
      session = new Session({
        user_id: req.user.id,
        title,
        tags,
        json_file_url,
        status: 'draft'
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
  const {title, tags, json_file_url, status } = req.body;
  try {
    // Use the authenticated user's ID from req.user (set by auth middleware)
    const session = new Session({
      user_id: req.user.id, // or req.user._id depending on your user model
      title,
      tags, // tags should be an array of strings
      json_file_url,
      status
    });

    logger.info(`Publishing session for user_id ${req.user.id} with title: ${title}`);
    await session.save();
    return res.status(201).json(session);

  } catch (error) {
    logger.error(`Session creation failed with user_id ${req.user.id}: ${error.message}`);
    return res.status(500).json({ message: "Failed to publish session" });
  }
});

// View a single user session
router.get("/my-sessions/:id", auth, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    logger.error(`Error fetching session ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to fetch session" });
  }
});

router.delete("/my-sessions/:id", auth, async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    logger.info(`Session ${req.params.id} deleted by user ${req.user.id}`);
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting session ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to delete session" });
  }
});

module.exports = router;
