# Live Chat Service

Live Chat Service is a real-time chat application designed to facilitate seamless communication between users. Built with modern web technologies, this project leverages Angular, RxJS, and Node.js to deliver a responsive and scalable solution for real-time interactions.

Prod version available: [https://l1node4fun.xyz](https://l1node4fun.xyz)  
Both front-end and back-end are hosted on a Linode server.


## Features

- **Real-time Communication:** Enables instant messaging using WebSocket technology.
- **Scalability:** Designed to handle multiple concurrent users efficiently.
- **User-Friendly Interface:** Intuitive and responsive(accessible from mobile as well) UI built with Angular. 
- **Reactive Programming:** Utilizes RxJS for managing real-time data streams.
- **Secure Connections:** Ensures data privacy and security during transmission.

## Technologies Used

- **Frontend:** Angular(v18.2.1), RxJS(v7.8.0)
- **Backend:** Node.js(v20.12.2), Express(v4.21.1)
- **WebSocket:** `ws`: a Node.js WebSocket library(v8.18.0)
- **Database:** SQLite3(v5.1.7)
- **Others:** JSON Web Token(v9.0.2), bcrypt(v5.1.1) (for secure password hashing)

---

## Getting Started

Follow these steps to set up the project on your local machine:

### Prerequisites

Before running the **Live Chat Service** project, ensure that the following prerequisites are installed and properly configured:

1. **Node.js**
   - **Minimum Version:** Node.js 16.x or later.
   - **Recommended Version:** Use the latest Long-Term Support (LTS) version (e.g., Node.js 18.x or 20.x).
   - [Download Node.js](https://nodejs.org/)

2. **npm (Node Package Manager)**
   - Installed automatically with Node.js.
   - **Minimum Version:** npm 8.x or later.
   - Check your npm version:
     ```bash
     npm -v
     ```

3. **Angular CLI** (Optional)
   - The Angular CLI is included as a local dependency (`@angular/cli`). However, you may install it globally for convenience:
     ```bash
     npm install -g @angular/cli@^18.2.1
     ```

---

### Run the Project

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dmate889/live_chat_service.git
   
   cd live_chat_service

2. **Run the WebSocket server**
   ```bash
   cd websocket-server
   
   node server.js
   
3. **Run the front-end**
   ```bash
   cd live_chat_service
   
   ng serve --open



## Future Plans

Here are some planned features and enhancements for the Live Chat Service:

1. **Online Users Interface**
   - Develop a dedicated interface on the frontend where users can see a live list of all currently online users. (UPDATE: Implemented)

2. **Admin Panel**
   - Create an admin-specific dashboard where administrators can perform CRUD (Create, Read, Update, Delete) operations on database tables.
   - The admin panel and its features will not be accessible to regular users, ensuring a secure separation of roles.

3. **User Management in Admin Panel**
   - Add functionality in the admin panel to manage users:
     - Ban users from accessing the service.
     - Delete, create, and update user accounts.
     - View user activity logs, including how much time each user has spent online.

4. **Private Messaging**
   - Implement private chat functionality, allowing users to initiate direct conversations with other online users.
   - Users will be able to click on an online user to open a private chat window for one-on-one communication.

These features aim to enhance the usability and scalability of the Live Chat Service, providing more control for administrators and better interaction options for users.

   
