const express = require('express');
const User = require('./user.model');
const router = express.Router();

//Registration end point
router.get("/",async(req,res)=>{
    res.send('Resistration routes')
})

router.post('/register',async(req,res)=>{
    try {
        const {username,email,password} = req.body;
        const user = new User({username,email,password});
        await user.save();
        res.status(201).send({message:"User registered successfully"});
    }catch (error){
        console.log(error)
    }
})
module.exports = router;