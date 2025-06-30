const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;


app.use(cors());
app.use(bodyParser.json());


const postRoutes = require('./routes/posts');
app.use('/posts', postRoutes);


const usersFile = path.join(__dirname, 'users.json');


app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const userExists = users.find(user => user.email === email);
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password
    };

    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.status(201).json({ message: 'Signup successful!', token: newUser.id });
  } catch {
    res.status(500).json({ error: 'Signup failed.' });
  }
});


  app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({
      message: 'Signin successful',
      token: user.id,           
      email: user.email,        
      username: user.username   
    });
  } 
  catch {
    res.status(500).json({ error: 'Signin failed.' });
  }
});

app.get('/profile/:id', (req, res) => {
  const id = req.params.id;
  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password, ...safeUser } = user; // Don't expose password
    res.json(safeUser);
  } catch {
    res.status(500).json({ error: 'Profile fetch failed.' });
  }
});





app.listen(PORT, () => {
  console.log(`✅ Blog server running at http://localhost:${PORT}`);
});
