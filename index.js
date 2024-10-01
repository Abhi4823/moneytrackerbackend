const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Track = require('./Modal/TrackModal.js');

dotenv.config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a post
app.post('/createpost', async (req, res) => {
    const { category, amount, info, date } = req.body;

    // Validate request body
    if (!category || !amount || !date) {
        return res.status(400).json({ error: 'Category, amount, and date are required.' });
    }

    try {
        const allpost = await Track.find();
        let nextind = allpost.length === 0 ? 0 : allpost[allpost.length - 1].id + 1;

        // Create new track entry
        await Track.create({
            id: nextind,
            category,
            amount,
            info,
            date,
        });

        res.status(201).json('Post has been submitted successfully.');
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'An error occurred while creating the post.' });
    }
});

// Get all posts
app.get('/getpost', async (req, res) => {
    try {
        const data = await Track.find().sort({ date: 1 });
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'An error occurred while fetching data.', details: err.message });
    }
});

// Delete a post
app.delete('/deletepost/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Track.findOneAndDelete({ id: id });

        if (!data) {
            return res.status(404).json({ error: 'Record not found.' });
        }

        res.status(200).json({ message: 'Post deleted successfully.', data });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'An error occurred while deleting the post.' });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully.');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
