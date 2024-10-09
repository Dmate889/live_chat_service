const sqlite3 = require('sqlite3').verbose();

//Initiating the SQLite connection
const db = new sqlite3.Database('./chat.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

//Creation of the table if we don't have it
db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, content TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)');

//Adding messages
const addMessage = (message, callback) => {
  const query = 'INSERT INTO messages (content) VALUES (?)';
  db.run(query, [message], function (err) {
    if (err) {
      return callback(err);
    }
    callback(null, this.lastID);
  });
};

//Getting the messages
const getMessages = (callback) => {
  const query = 'SELECT content, timestamp FROM messages ORDER BY timestamp ASC';
  db.all(query, [], (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
};

//Importing to server.js
module.exports = {
  addMessage,
  getMessages,
};
