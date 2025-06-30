const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const postsFile = path.join(__dirname, '../data/posts.json');

router.get('/', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));
  res.json(posts);
});

router.post('/', (req, res) => {
  const { title, content, image, category,email } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const posts = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));
  const duplicate = posts.find(post => post.title.toLowerCase() === title.toLowerCase());
  if (duplicate) {
    return res.status(400).json({ error: 'Title already exists' });
  }

  const newPost = {
    id: Date.now().toString(),
    title,
    content,
    image: image || '/assets/banner.png',
    category,
    email
  };

  posts.push(newPost);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.status(201).json({ message: 'Post created' });
});

router.get('/:id', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

router.put('/:id', (req, res) => {
  const { title, content, image } = req.body;
  const posts = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Post not found' });

  posts[index] = { ...posts[index], title, content, image };
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.json({ message: 'Post updated' });
});

router.delete('/:id', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Post not found' });

  posts.splice(index, 1);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.json({ message: 'Post deleted' });
});

module.exports = router;
