require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import the models
const Quiz = require('./models/quiz');
const Users = require('./models/users');

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

        res.status(201).json({ token });
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

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, username: user.username, email: user.email });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Routes for quizzes
app.post('/api/quizzes', async (req, res) => {
    try {
        const { title, creatorId, questions } = req.body;

        console.log('Received data:', req.body); // Log the received data

        // Validate input
        if (!title || !creatorId || !Array.isArray(questions)) {
            console.error('Invalid input:', { title, creatorId, questions });
            return res.status(400).json({ error: 'Invalid input' });
        }

        // Validate each question
        for (const question of questions) {
            if (!question.question || !Array.isArray(question.options) || !question.answer) {
                console.error('Invalid question format:', question);
                return res.status(400).json({ error: 'Invalid question format' });
            }
        }

        // Create and save quiz
        const quiz = new Quiz({ title, creatorId, questions });
        await quiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        console.error('Error creating quiz:', err);
        res.status(500).json({ error: 'Error creating quiz' });
    }
});



app.get('/api/quizzes/:quizId', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).send('Quiz not found');
        res.send(quiz);
    } catch (err) {
        console.error('Error retrieving quiz:', err);
        res.status(500).send('Error retrieving quiz');
    }
});

app.put('/api/quizzes/:quizId', async (req, res) => {
    try {
        const { title, questions } = req.body;
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.quizId,
            { title, questions },
            { new: true }
        );
        if (!quiz) return res.status(404).send('Quiz not found');
        res.send(quiz);
    } catch (err) {
        console.error('Error updating quiz:', err);
        res.status(500).send('Error updating quiz');
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
