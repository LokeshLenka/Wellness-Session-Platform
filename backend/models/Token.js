const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // This will automatically delete the document when it expires
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
TokenSchema.index({ user: 1, token: 1 });

module.exports = mongoose.model('Token', TokenSchema);
