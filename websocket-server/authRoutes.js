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


  router.get('/query', (req, res) => {
    let usersOnline = [];
    let usersAll = [];

    db.getUsersRecord('online', (err, onlineUsers) => {
        if (err) {
            console.log('Error fetching online users:', err);
            return res.status(500).json({ message: 'Error fetching online users' });
        }

        usersOnline = onlineUsers;

        db.getUserRecordsAll((err, allUsers) => {
            if (err) {
                console.log('Error fetching all users:', err);
                return res.status(500).json({ message: 'Error fetching all users' });
            }

            usersAll = allUsers;

            res.status(200).json({
                message: 'Users fetched successfully',
                onlineUsers: usersOnline,
                allUsers: usersAll
            });
        });
    });
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


  module.exports = router;