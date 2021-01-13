const express = require('express');
const http = require('http');

const socket = require('socket.io');
const multer = require('multer');
const path = require('path');

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
  console.log(socket.id);
  socket.emit('userId', socket.id);
  socket.on('sendCurrentUser', (body) => {
    socket.broadcast.emit('sendNewUser', body);
  });
});

server.listen(port, () => console.log('server is running on port 5000'));

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
