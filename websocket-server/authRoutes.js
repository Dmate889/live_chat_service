// This is a routing file. It contains all the API endpoints created by express. I have modularized these into separate route handlers for better organization.

const express = require('express');
const db = require('./databases/db');

const router = express.Router();
const cors = require('cors');

const corsOptions = {
    origin: 'https://l1node4fun.xyz', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
  };

//API endpoint for the register service 
router.post('/register', cors(corsOptions), (req, res) => {
    const { username, password } = req.body;
    db.authUsers(username, password, (err) => {
        if (err) {
            console.log('Error during registration:', err);
            return res.status(409).json({ message: 'Registration error: User already exist or DB issue.' });
        }
        res.status(200).json({ message: 'User registered successfully' });
    });
  });
  
  //API endpoint for login page
  router.post('/login', cors(corsOptions), async (req, res) => {
    const { username, password } = req.body;
        db.getUsers(username, password, (err, result) => {
            if (result.success) {
                res.status(200).json({ message: 'Login successful', token: result.token });
            } else {
                res.status(401).json({ message: result.message });
            }
        });   
  });

  module.exports = router;