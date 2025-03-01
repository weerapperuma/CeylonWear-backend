const express = require('express');
const User = require('./user.model');
const router = express.Router();

// Registration Route
router.get("/", async (req, res) => {
    res.send('Registration routes');
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();

        res.status(201).send({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error Registering the user", error);
        res.status(500).send({ message: "Error Registering the user" });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        res.status(200).send({ message: "Logged in successfully!", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
