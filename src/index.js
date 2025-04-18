const path = require('path');
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const rootRouter = require('./routes');
const connect = require('./config');

connect();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://whenever-client.vercel.app'],
  credentials: true,
};

const app = express();

// Log incoming origins for debugging
app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Root Router
rootRouter(app);

// Create server based on environment
let server;
if (process.env.NODE_ENV === 'production') {
  server = http.createServer(app); // Hosting platform handles HTTPS
} else {
  // Use self-signed certificates for local development
  const privateKey = fs.readFileSync(path.join(__dirname, 'key.pem'), 'utf8');
  const certificate = fs.readFileSync(path.join(__dirname, 'cert.pem'), 'utf8');
  const credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials, app);
}

// LISTEN PORT
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on ${process.env.NODE_ENV === 'production' ? 'http' : 'https'}://localhost:${PORT}`);
});