// const express = require('express');
// const bcrypt = require('bcryptjs'); 
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const router = express.Router();


// router.post('/signup', async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     console.error('Signup Error:', err);
//     res.status(500).json({ error: 'Signup failed' });
//   }
// });


// router.post('/signin', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     res.json({ message: 'Login successful', token });
//   } catch (err) {
//     console.error('Signin Error:', err);
//     res.status(500).json({ error: 'Signin failed' });
//   }
// });

// module.exports = router;




const express = require('express');
const bcrypt = require('bcryptjs'); // Windows-friendly bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// POST /signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// POST /signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Signin Error:', err);
    res.status(500).json({ error: 'Signin failed' });
  }
});

module.exports = router;
