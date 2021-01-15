const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = 5000;
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const multer = require('multer');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static('file-storage'));

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
  socket.emit('userId', socket.id);
  socket.on('sendCurrentUser', (body) => {
    socket.broadcast.emit('sendNewUser', body);
  });
  socket.on('clientSendFirstUser', (data) => {
    socket.broadcast.emit('serverSendFirstUser', data);
  });

  socket.on('currentUserMove', (data) => {
    io.emit('otherUserMove', data);
  });

  socket.on('send message', (body) => {
    io.emit('message', body);
  });

  socket.on('joinShifoumi', (room) => {
    socket.join(room);
    io.to('room1').emit('welcome', 'you join the room');
  });

  socket.on('userJoin', (user) => {
    socket.to('room1').broadcast.emit('player2', user);
  });

  socket.on('player1Choice', (choice) => {
    console.log(choice);
    socket.to('room1').broadcast.emit('player2Choice', choice);
  });

  socket.on('player1Score', (score) => {
    socket.to('room1').broadcast.emit('player2Score', score);
  });

  socket.on('notification', (message) => {
    io.emit('send-notification', message);
  });
});

http.listen(port, () => console.log('server is running on port 5000'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'file-storage');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

app.post(
  '/uploaddufichier',
  upload.single('main_picture'),
  (req, res, next) => {
    const dataToSend = { path: req.file.originalname, name: req.body.title };
    res.send(dataToSend);
  }
);
