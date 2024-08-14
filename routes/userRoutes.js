const express = require('express')
const {newUser, loginUser, getAllUsers, currentUser} = require('../services/UserService');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = 'SenhaSuperSecreta';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.post('/register', async(req,res) => {

    try {

        const user = await newUser (req.body);
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


router.post('/login', async (req, res) =>{

    try{

        const {user, token} = await loginUser (req.body.email, req.body.password);
        res.status(200).json({ user,token});

    } catch (error) {
        res.status(401).json({ error: error.message });
    }

});

router.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await currentUser(req.headers['authorization'].split(' ')[1]);
        res.status(200).json(user);
    } catch (error) {
        res.status(403).json({ error: error.message });s
    }
});


module.exports = router;

