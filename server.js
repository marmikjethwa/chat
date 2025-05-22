const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');


const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

const pool = new Pool({
  user: 'message_bdb4_user',
  host: 'dpg-d0nivceuk2gs73c1ktsg-a.oregon-postgres.render.com',
  database: 'message_bdb4',
  password: 'dthRj132ZsYaZcHEZE0RIrfUvL6mVCzG',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Root route to check if server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// GET messages for a chat_code
app.get('/messages/:chat_code', async (req, res) => {
  const { chat_code } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM chats WHERE chat_code = $1 ORDER BY timestamp ASC',
      [chat_code]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// POST a new message
app.post('/send', async (req, res) => {
  const { chat_code, sender, message } = req.body;
  try {
    await pool.query(
      'INSERT INTO chats (chat_code, sender, message) VALUES ($1, $2, $3)',
      [chat_code, sender, message]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

