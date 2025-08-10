const express = require("express");
const Session = require("../models/Session");
// const auth = require('../middleware/auth');

const router = express.Router();

router.get("/sessions", async (req, res) => {
  // get published sessions
});

router.get(
  "/my-sessions",
  //  auth,
  async (req, res) => {
    // get user's own sessions
  }
);

module.exports = router;
