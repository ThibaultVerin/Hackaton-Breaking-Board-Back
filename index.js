const express = require('express');
const http = require('http');

const socket = require('socket.io');

const port = 5000;
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const io = socket(server);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
];
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send();
});

io.on('connection', (socket) => {
  socket.emit('your id', socket.id);
  socket.on('send message', (body) => {
    io.emit('message', body);
  });
});

server.listen(port, () => console.log('server is running on port 5000'));
