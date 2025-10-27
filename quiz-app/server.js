// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
// No need for express.static here, vercel.json handles it.
// app.use(express.static('public')); 

// API endpoint to get quiz questions
app.get('/api/questions', (req, res) => {
    // Read the file relative to the current directory
    const filePath = path.join(process.cwd(), 'questions.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred while reading the questions file.');
        }
        res.json(JSON.parse(data));
    });
});

// IMPORTANT: Export the app for Vercel
module.exports = app;

// REMOVE or COMMENT OUT the app.listen() part
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});