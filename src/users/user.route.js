const express = require('express');
const User = require('./user.model');
const generateToken = require("../middleware/generateToken");
const router = express.Router();

router.get("/", async (req, res) => {
    res.send('Registration routes');
});
// Register End point
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

// Login User Endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid credentials" });
        }
        const token = await generateToken(user._id);
        res.cookie("token", token,{
            httpOnly:true,
            secure: true,
            sameSite: "none",
        });

        res.status(200).send({
            message: "Logged in successfully!", user:{
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Logout User Endpoint
router.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.status(200).send({ message: "Logged out successfully" });
});

//delete a user endpoint
router.delete('/users/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user){
            return res.status(404).send({message:"User not found"});
        }
        res.status(200).send({message:"User deleted successfully"});
    }catch (error){
        console.error("Error deleting user:", error);
        res.status(500).send({message:"Error deleting user"});
    }
})

//get all users endpoint
router.get('/users', async (req, res) => {
    try{
        const users = await User.find({},'id email role').sort({createdAt:-1});
        res.status(200).send(users);
    }catch (error){
        console.error("Error getting users:", error);
        res.status(500).send({message:"Error getting users"});
    }
})
module.exports = router;
