const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = process.env.AUTH_SECRET || 'dev-secret-key';

const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');
function loadUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const obj = JSON.parse(raw || '{}');
    return new Map(Object.entries(obj));
  } catch (e) {
    return new Map();
  }
}

function saveUsers(map) {
  const obj = Object.fromEntries(map);
  fs.writeFileSync(USERS_FILE, JSON.stringify(obj, null, 2));
}

const users = loadUsers();

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  if (users.has(email)) return res.status(409).json({ message: 'User already exists' });
  const hash = await bcrypt.hash(password, 8);
  users.set(email, { name, email, passwordHash: hash });
  try { saveUsers(users); } catch (e) { console.warn('Failed to save users:', e); }
  const payload = { sub: email, name, email };
  const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  const user = users.get(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const payload = { sub: email, name: user.name, email };
  const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(4000, () => console.log('Auth demo running on http://localhost:4000'));
