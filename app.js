require('dotenv').config(); // Load environment variables from .env file

const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const db = require('./db'); // Import the database configuration
const ChatMessage = require('./chatMessage'); // Import the ChatMessage model

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Handling socket.io
io.on('connection', (socket) => {
  console.log('A New user has connected', socket.id);
  
  socket.on('user_message', async (message) => {
    console.log('A new User message ', message);
    io.emit('message', message);

    // Save the message to MongoDB
    const chatMessage = new ChatMessage({
      user: message.user,
      message: message.message,
    });
    try {
      await chatMessage.save();
      console.log('Message saved to MongoDB:', message);
    } catch (error) {
      console.error('Error saving message to MongoDB:', error);
    }
  });
});

app.use(express.static('./public'));

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '/public/index.html'));
});

server.listen(8001, () => console.log('Server Started at Port 8001'));
