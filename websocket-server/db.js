const sqlite3 = require('sqlite3');

//Declaring the database
const db = new sqlite3.Database('./chat.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if(err) console.log('An error occured during the creation of the database');
  else console.log('The database has been successfully created');

});

//Create the table
db.run('CREATE TABLE IF NOT EXISTS messages (id, INTEGER PRIMARY KEY, content TEXT, sender TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)');

//Inserting into the table
function addMessage(message){
  const query = 'INSERT INTO messages (content) VALUES (?)';

  db.run(query, [message], (err) => {
    if(err) console.log('An error has occured when you tried to run the query: '+ query + err)
  });
}

//Running the query on all rows of the table
function getMessages(callback){
  const query = 'SELECT content, timestamp, sender FROM messages ORDER BY timestamp ASC';

  db.all(query,[],(err, rows) => {
    if(err){
      console.log('An error has occured when you tried to run the query: '+ query + err)
      return callback(err)
    } 
    else callback(null, rows);
  });
}

module.exports = {
  addMessage,
  getMessages
};


