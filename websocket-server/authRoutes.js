// This is a routing file. It contains all the API endpoints created by express. I have modularized these into separate route handlers for better organization.

const express = require('express');
const db = require('./databases/db');

const router = express.Router();
// const cors = require('cors');


// const corsOptions = {
//     origin: 'http://localhost:4200', 
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Authorization', 'Content-Type'],
//     credentials: true
//   };

//   app.use(cors(corsOptions));

//API endpoint for the register service 
router.post('/register', (req, res) => {
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
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
        db.getUsers(username, password, (err, result) => {
            if (result.success) {
                res.status(200).json({ message: 'Login successful', token: result.token });
            } else  {
                res.status(401).json({ message: result.message });
            }
        });   
  });


  router.get('/query', async (req, res) => {
    try {
        const usersOnline = await db.getUsersRecord('online');
        const usersAll = await db.getUserRecordsAll();

        res.status(200).json({
            message: 'Users fetched successfully',
            onlineUsers: usersOnline,
            allUsers: usersAll
        });
    } catch (err) {
        console.log('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users' });
    }
});


    router.get('/messages', (req,res) => {
        let newMessages = [];

        db.getMessages((err, messages) =>{
            if(err){
                console.log('Error fetching messages', err);
                return res.status(500).json({message: 'Error fetching all users'});
            }
            
            newMessages = messages;
            res.status(200).json({
                message: 'Messages are fetched',
                newMessages : newMessages
            });
        });             
    });

    router.patch('/isactive', (req, res) => {
        const {userName, isActive} = req.body;

        db.setUserIsActive(userName, isActive, (err, result) =>{
            if(result.success){
                res.status(200).json({message: 'User isActive change has been changed successfully' });
            }
            else res.status(500).json({message: 'DB error when tried to change user isActive state'});
        });
    });


  module.exports = router;