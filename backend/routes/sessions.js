const express = require("express");
const Session = require("../models/Session");
const auth = require("../middleware/auth");

const router = express.Router();

// get all public wellness sessions
router.get("/sessions", async (req, res) => {
  // get published sessions
});

//get user’s own sessions (draft + published)
router.get("/my-sessions", auth, async (req, res) => {
  // get user's own sessions
});

// Save or update a draft session
router.post("/my-sessions/save-draft", auth, async (req, res) => {
  // create a new session
});

// Publish a session
router.post("/my-sessions/publish", auth, async (req, res) => {
  // create a new session
});

// View a single user session
router.get("/my-sessions/:id", auth, async (req, res) => {
  // get a session by ID
});

router.delete("/my-sessions/:id", auth, async (req, res) => {
  // delete a session
});

module.exports = router;
