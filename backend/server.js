require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import the models
const Users = require('./models/users');
const Quiz = require('./models/quiz');

// Initialize Express application
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully to KyronDatabase'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// User registration route
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await Users.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        user = new Users({ username, email, password });
        await user.save();

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, creatorId: user._id, username: user.username, email: user.email });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// User login route
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const payload = { userId: user._id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, creatorId: user._id, username: user.username, email: user.email });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a quiz
app.post('/api/quizzes', async (req, res) => {
    try {
        const { title, creatorId, questions } = req.body;

        if (!title || !creatorId || !Array.isArray(questions)) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        for (const question of questions) {
            if (!question.question || !Array.isArray(question.options) || !question.correctAnswer) {
                return res.status(400).json({ error: 'Invalid question format' });
            }
        }

        const quiz = new Quiz({ title, creatorId, questions });
        await quiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        console.error('Error creating quiz:', err);
        res.status(500).json({ error: 'Error creating quiz' });
    }
});

// Get quizzes by creatorId and title
app.get('/api/quizzes', async (req, res) => {
    const { creatorId, title } = req.query;
    try {
        let query = {};
        if (creatorId) {
            query.creatorId = creatorId;
        }
        if (title) {
            query.title = title;
        }
        const quizzes = await Quiz.find(query);
        if (quizzes.length === 0) return res.status(404).json({ error: 'Quiz not found' });
        res.json(quizzes); // Return all matching quizzes
    } catch (err) {
        console.error('Error retrieving quizzes:', err);
        res.status(500).json({ error: 'Error retrieving quizzes' });
    }
});

// Get a quiz by ID and creatorId
app.get('/api/quizzes/:quizId', async (req, res) => {
    const { quizId } = req.params;
    const { creatorId } = req.query; // Assume the creator ID is passed as a query parameter

    try {
        const quiz = await Quiz.findOne({ _id: quizId, creatorId });
        if (!quiz) return res.status(404).json({ error: 'Quiz not found or you are not the creator' });
        res.json(quiz);
    } catch (err) {
        console.error('Error retrieving quiz:', err);
        res.status(500).json({ error: 'Error retrieving quiz' });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
