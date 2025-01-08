const { all } = require("./authRoutes");
const db = require("./databases/db");
const WebSocket = require("ws");


async function fetchUsers(server,ws){
    try{
      const onlineUsers = await db.getUsersRecord('online');
      

      const userList =  onlineUsers.map((user) => ({
        name: user.name,
        createdAt: user.createdAt
      }));
     
      server.clients.forEach(client => {
        if(client.readyState  === WebSocket.OPEN){
          ws.send(
            JSON.stringify({
              type: 'userList',
              users: userList
            })
          )
        }
      });

      const allUsers = await db.getUserRecordsAll();

      const userListAll = allUsers.map((user) => ({
        name: user.name,
        createdAt: user.createdAt,
        state: user.state
      }));

      server.clients.forEach(client => {
        if(client.readyState  === WebSocket.OPEN){
          ws.send(
            JSON.stringify({
              type: 'userListAll',
              users: userListAll
            })
          )
        }
      });
    }

    catch(error){
      console.error('Error fetching users on the server side', error);
    }
  }

  module.exports = {
    fetchUsers
  };