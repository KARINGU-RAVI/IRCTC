const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Middleware for verifying JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Access Denied: No Token Provided!');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};

// Middleware for admin role
const adminMiddleware = (req, res, next) => {
  const adminApiKey = req.header('x-api-key');
  if (adminApiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).send('Access Denied: Admins Only!');
  }
  next();
};

// Register a user
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  console.log(username)
  const sql = `INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, 'user')`;
  connection.query(sql, [username, hashedPassword, email], (err, results) => {
    if (err) return res.status(500).send('There was a problem registering the user.');
    res.status(201).send({ message: 'User registered successfully!' });
  });
});

// // Login a user
// app.post('/api/auth/login', (req, res) => {
//   const { username, password } = req.body;

//   const sql = `SELECT * FROM users WHERE username = ?`;
//   connection.query(sql, [username], (err, results) => {
//     if (err || results.length === 0) return res.status(404).send('No user found.');

//     const user = results[0];
//     const passwordIsValid = bcrypt.compareSync(password, user.password);
//     if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

//     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: 86400 });
//     res.status(200).send({ auth: true, token });
//   });
// });

// // Add a new train (Admin only)
// app.post('/api/trains/add-train', authMiddleware, adminMiddleware, (req, res) => {
//   const { train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination } = req.body;

//   const sql = `INSERT INTO trains (train_name, source, destination, seat_capacity, available_seats, arrival_time_at_source, arrival_time_at_destination) VALUES (?, ?, ?, ?, ?, ?, ?)`;
//   connection.query(sql, [train_name, source, destination, seat_capacity, seat_capacity, arrival_time_at_source, arrival_time_at_destination], (err, results) => {
//     if (err) return res.status(500).send('There was a problem adding the train.');
//     res.status(201).send({ message: 'Train added successfully!' });
//   });
// });

// // Get seat availability
// app.get('/availability', authMiddleware, (req, res) => {
//   const { source, destination } = req.query;

//   const sql = `SELECT id as train_id, train_name, available_seats FROM trains WHERE source = ? AND destination = ?`;
//   connection.query(sql, [source, destination], (err, results) => {
//     if (err) return res.status(500).send('There was a problem finding the trains.');
//     res.status(200).send(results);
//   });
// });

// // Book a seat
// app.post('/api/trains/book-seat', authMiddleware, (req, res) => {
//   const { train_id, no_of_seats } = req.body;
//   const user_id = req.user.id;

//   const sqlSelect = `SELECT available_seats FROM trains WHERE id = ?`;
//   connection.query(sqlSelect, [train_id], (err, results) => {
//     if (err || results.length === 0) return res.status(404).send('Train not found.');

//     const train = results[0];
//     if (train.available_seats >= no_of_seats) {
//       const updatedSeats = train.available_seats - no_of_seats;

//       const sqlUpdate = `UPDATE trains SET available_seats = ? WHERE id = ?`;
//       connection.query(sqlUpdate, [updatedSeats, train_id], (err, results) => {
//         if (err) return res.status(500).send('There was a problem booking the seat.');
//         res.status(200).send({ message: 'Seat booked successfully!', train_id, user_id, no_of_seats });
//       });
//     } else {
//       res.status(400).send('Not enough seats available.');
//     }
//   });
// });

// // Get specific booking details
// app.get('/api/trains/booking-details', authMiddleware, (req, res) => {
//   const { train_id } = req.query;
//   const user_id = req.user.id;

//   const sql = `SELECT id as train_id, train_name FROM trains WHERE id = ?`;
//   connection.query(sql, [train_id], (err, results) => {
//     if (err || results.length === 0) return res.status(404).send('Train not found.');
//     const train = results[0];
//     res.status(200).send({ train_id: train.train_id, train_name: train.train_name, user_id });
//   });
// });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
