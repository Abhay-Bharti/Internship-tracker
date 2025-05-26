const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Application = require('../models/Application');
const { body, validationResult } = require('express-validator');

// Get user's skills
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('skills');
        res.json(user.skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add or update skill
router.post('/', auth, [
    body('name').notEmpty().trim().withMessage('Skill name is required'),
    body('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid skill level')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { name, level } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if skill already exists
        const skillIndex = user.skills.findIndex(skill => skill.name.toLowerCase() === name.toLowerCase());
        
        if (skillIndex >= 0) {
            // Update existing skill
            user.skills[skillIndex].level = level;
        } else {
            // Add new skill
            user.skills.push({ name, level });
        }

        await user.save();
        res.json(user.skills);
    } catch (error) {
        console.error('Error saving skill:', error);
        res.status(500).json({ message: 'Failed to save skill. Please try again.' });
    }
});

// Remove skill
router.delete('/:name', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        user.skills = user.skills.filter(skill => skill.name !== req.params.name);
        await user.save();
        res.json(user.skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get skill gap analysis
router.get('/gap-analysis', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const applications = await Application.find({ user: req.user.userId });

        // Extract required skills from all applications
        const requiredSkills = new Map();
        applications.forEach(app => {
            app.requiredSkills.forEach(skill => {
                if (!requiredSkills.has(skill.name)) {
                    requiredSkills.set(skill.name, {
                        name: skill.name,
                        importance: skill.importance,
                        count: 1
                    });
                } else {
                    requiredSkills.get(skill.name).count++;
                }
            });
        });

        // Compare with user's skills
        const skillGaps = [];
        for (const [name, data] of requiredSkills) {
            const userSkill = user.skills.find(s => s.name === name);
            if (!userSkill) {
                skillGaps.push({
                    name,
                    importance: data.importance,
                    status: 'missing',
                    count: data.count
                });
            } else if (userSkill.level === 'beginner' && data.importance === 'required') {
                skillGaps.push({
                    name,
                    importance: data.importance,
                    status: 'needs_improvement',
                    currentLevel: userSkill.level,
                    count: data.count
                });
            }
        }

        // Sort by importance and frequency
        skillGaps.sort((a, b) => {
            if (a.importance === b.importance) {
                return b.count - a.count;
            }
            return a.importance === 'required' ? -1 : 1;
        });

        res.json(skillGaps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 