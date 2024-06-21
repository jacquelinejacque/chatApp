import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server);

const corsOptions = {
  origin: 'http://localhost:3000',
};

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let socketConnected= new Set();
io.on('connection', onConnected);

function onConnected(socket){
  console.log('New client connected:', socket.id);
  socketConnected.add(socket.id);
  io.emit('clients-total', socketConnected.size);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    socketConnected.delete(socket.id);
    io.emit('clients-total', socketConnected.size);
  });

  socket.on('message', (data) => {
    console.log(`Received message: `, data);
    socket.broadcast.emit('chat-message', data);
  });
}

// Port
const PORT = process.env.PORT || 3000;

// Server
server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
