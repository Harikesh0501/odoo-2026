const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mobile: {
        type: String,
    },
    department: {
        type: String,
    },
    manager: {
        type: String,
    },
    location: {
        type: String,
    },
    about: {
        type: String,
    },
    skills: {
        type: [String],
        default: []
    },
    certifications: [{
        name: String,
        date: Date,
        issuer: String
    }],
    resumeLink: {
        type: String
    },
    jobInterests: {
        type: String
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);
