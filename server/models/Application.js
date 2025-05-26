const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['applied', 'interviewing', 'offered', 'rejected', 'accepted'],
        default: 'applied'
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date
    },
    requiredSkills: [{
        name: String,
        importance: {
            type: String,
            enum: ['required', 'preferred', 'optional']
        }
    }],
    contact: {
        name: String,
        email: String,
        phone: String
    },
    notes: String,
    interviewDate: Date,
    offerDetails: {
        salary: Number,
        benefits: String,
        startDate: Date
    }
});

module.exports = mongoose.model('Application', applicationSchema); 