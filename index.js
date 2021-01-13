const express = require('express');
const connection = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const port = 5000;
const app = express();
const cors = require('cors');

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
  res.send('test');
});

app.get('/posts', (req, res) => {
  res.send('post');
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something went wrong');
  }
  console.log('all working well');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'file-storage');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

app.post('/uploaddufichier', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
  });
});
