const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() { return !this.googleId; }, // Required if no googleId
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Unique index only for docs with googleId
    },
    picture: String,
    dateCreated: {
        type: Date,
        default: Date.now, 
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;