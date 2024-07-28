const mongoose = require('mongoose');

// Define the quiz schema
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creatorId: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      correctAnswer: { type: String, required: true },
    },
  ],
});

// Create and export the Quiz model
module.exports = mongoose.model('Quiz', quizSchema);
