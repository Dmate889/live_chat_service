const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = '12345';


const db = new sqlite3.Database('./auth.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,  (err) => {
    if(err) console.log('There was an error creating the database');
    else console.log('The database_auth has been successfully created');
})

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, password TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)');

//Inserting new users into the DB
async function authUsers(name, password){    
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, password) VALUES (?,?)';
    
    db.run(query,[name, hashedPassword], (err) => {
        if(err) console.log('Could not run the query: '+ query);
        else console.log('Data has been inserted to auth.db');
    });
}


//Getting users from the DB
async function getUsers(name, password, callback){
    const query = 'SELECT name, password FROM users WHERE name = ?';
        db.get(query,[name], async (err, row) => {
            if(err){
                console.log('Could not fetch user: ' + err)
                return callback(err);
            }
            if(row && await bcrypt.compare(password, row.password)){
                const token = jwt.sign({name: row.name}, JWT_SECRET, {expiresIn: '5h'});
                callback(null,{success: true, token});
            }
             else callback(null,{success: false, message: 'Invalid username or password'});
        });
    
    
}

module.exports ={
    authUsers,
    getUsers,
    JWT_SECRET
}

