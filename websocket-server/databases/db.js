const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = '12345';

//Declaring the database
const db = new sqlite3.Database('./chat.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if(err) console.log('An error occured during the creation of the database');
  else console.log('The database_msg has been successfully created');

});

//Create the tables
db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, content TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id))');
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, password TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)');

//Inserting new users into the DB
async function authUsers(username, password, callback){  
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, password) VALUES (?,?)';
    
    db.run(query,[username, hashedPassword], (err) => {
        if(err) {
            console.log('Could not run the query: '+ query);
            callback(err);   
        }
        else{
            console.log('Data has been inserted to auth.db');
            callback(null);
        } 
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

//Inserting into the table
function addMessage(message){
  const query = 'INSERT INTO messages (content) VALUES (?)';

  db.run(query, [message], (err) => {
    if(err) console.log('An error has occured when you tried to run the query: '+ query + err)
  });
}

//Running the query on all rows of the table
function getMessages(callback){
  const query = 'SELECT content, timestamp FROM messages ORDER BY timestamp ASC';

  db.all(query,[],(err, rows) => {
    if(err){
      console.log('An error has occured when you tried to run the query: '+ query + err)
      return callback(err)
    } 
    else callback(null, rows);
  });
}

//Exporting the 2 functions, so it can be used in server.js
module.exports = {
  addMessage,
  getMessages,
  authUsers,
  getUsers,
  JWT_SECRET
};


