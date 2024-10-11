const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./auth.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,  (err) => {
    if(err) console.log('There was an error creating the database');
    else console.log('The database has been successfully created');
})

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)');

function authUsers(id, name){
    const query = 'INSERT INTO users (id,name,email,createdAt) VALUES (NULL,?,?,?)';

    db.run(query,[id, name], (err) => {
        if(err) console.log('Could not run the query: '+ query);
        else console.log('Data has been inserted to auth.db');
    });
}

function getUsers(){
    const query = 'SELECT name FROM users';

    db.all(query,[],(err) => {
        if(err) console.log('Could not run the query: '+ query);
    })

}

module.exports ={
    authUsers,
    getUsers
}

