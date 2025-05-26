const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const { body, validationResult } = require('express-validator');

// Get all applications for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.userId })
            .sort({ applicationDate: -1 });
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new application
router.post('/', auth, [
    body('company').notEmpty().withMessage('Company name is required'),
    body('position').notEmpty().withMessage('Position is required'),
    body('jobDescription').notEmpty().withMessage('Job description is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const application = new Application({
            ...req.body,
            user: req.user.userId
        });

        await application.save();
        res.status(201).json(application);
    } catch (error) {
        console.error('Error saving application:', error);
        res.status(500).json({ message: 'Failed to save application. Please try again.' });
    }
});

// Update application
router.put('/:id', auth, async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        Object.assign(application, req.body);
        await application.save();
        res.json(application);
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ message: 'Failed to update application. Please try again.' });
    }
});

// Delete application
router.delete('/:id', auth, async (req, res) => {
    try {
        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: 'Failed to delete application. Please try again.' });
    }
});

// Get application statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const stats = await Application.aggregate([
            { $match: { user: req.user.userId } },
            { $group: {
                _id: '$status',
                count: { $sum: 1 }
            }}
        ]);

        res.json(stats);
    } catch (error) {
        console.error('Error fetching application stats:', error);
        res.status(500).json({ message: 'Failed to fetch application statistics. Please try again.' });
    }
});

module.exports = router; 