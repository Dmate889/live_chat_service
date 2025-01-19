const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "12345";

//Declaring the database
const db = new sqlite3.Database(
  "./chat.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err)
      console.log("An error occured during the creation of the database");
    else console.log("The database_msg has been successfully created");
  }
);

//Create the tables
db.run(
  "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, content TEXT, timestamp DATETIME, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id))"
);
db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, password TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, role TEXT DEFAULT user, state TEXT DEFAULT offline, isActive INTEGER DEFAULT 1)"
);

//Inserting new users into the DB
async function authUsers(username, password, callback) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = "INSERT INTO users (name, password) VALUES (?,?)";

  db.run(query, [username, hashedPassword], (err) => {
    if (err) {
      console.log("Could not run the query: " + query);
      callback(err);
    } else {
      console.log("Data has been inserted to auth.db");
      callback(null);
    }
  });
}

//Getting users from the DB
async function getUsers(name, password, callback) {
  const query = "SELECT id, name, password, isActive FROM users WHERE name = ?";
  db.get(query, [name], async (err, row) => {
    if (err) {
      console.log("Could not fetch user: " + err);
      return callback(err);
    }
    if (row && row.isActive === 1 && (await bcrypt.compare(password, row.password))) {
      const token = jwt.sign({ id: row.id, name: row.name }, JWT_SECRET, {
        expiresIn: "5h",
      });
      callback(null, { success: true, token });
    } else
      callback(null, {
        success: false,
        message: "Invalid username or password",
      });
  });
}

//Inserting into the table
function addMessage(message, user_id) {
  const localTimestamp = new Date().toISOString();
  const query =
    "INSERT INTO messages (content, user_id, timestamp) VALUES (?, ?, ?)";

  db.run(query, [message, user_id, localTimestamp], function (err) {
    if (err)
      console.log("An error occurred while running the query: " + query + err);
  });
}

//Running the query on all rows of the table
function getMessages(callback) {
  const query =
    "SELECT messages.content, messages.timestamp, users.name FROM messages INNER JOIN users ON messages.user_id = users.id ORDER BY timestamp ASC";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log(
        "An error has occured when you tried to run the query: " + query + err
      );
      return callback(err);
    } else {
      callback(null, rows);
    }
  });
}

//Getting the online users from the users table
function getUsersRecord(state) {

  return new Promise((resolve, reject) => {
    const query = "SELECT name, createdAt FROM users WHERE state = ?";
  
    db.all(query, [state], (err, rows) => {
      if (err) {
        console.error(`There was a fetching users with ${query}`, err);
        reject(err);
      } else {
        resolve(rows);
        }
    });
  });
}

function getUserRecordsAll(){

  return new Promise((resolve, reject) => {
    const query = "SELECT name, createdAt, state, isActive FROM users";
  
    db.all(query, [], (err, rows)=>{
      if(err){
        console.log(`There was a problem fetching users with ${query}`, err);
        reject(err);
      }
      else {
        resolve(rows);
      }
    });
  });
}

function setStateUsersOnline(name) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE users SET state = ? WHERE name = ?";
  
    db.run(query, ["online", name], (err) => {
      if (err) {
        console.log(`There was a problem with ${query}` + err);
        reject(err);
      } else {
        console.log(`${name} is now online.`);
        resolve();
      }
    });
  });
}

function setStateUsersOffline(name, callback) {
  const query = "UPDATE users SET state = ? WHERE name = ?";

  db.run(query, ["offline", name], (err) => {
    if (err) {
      console.log(`There was a problem with ${query}` + err);
      return callback(err);
    } else {
      console.log(`${name} is now offline.`);
    }
  });
}

function setUserIsActive(name, isActive, callback){
  const query = 'UPDATE users SET isActive = ? WHERE name = ?';

  db.run(query,[isActive,name], (err) => {
    if(err){
      console.log(`There was a problem with the ${query} query`);
      return callback(err);
    }
    else console.log(`The isActive state has been changed on DB`);
  })
}

//Exporting the functions, so it can be used in server.js
module.exports = {
  addMessage,
  getMessages,
  authUsers,
  getUsers,
  getUsersRecord,
  getUserRecordsAll,
  setStateUsersOnline,
  setStateUsersOffline,
  setUserIsActive,
  JWT_SECRET,
};
