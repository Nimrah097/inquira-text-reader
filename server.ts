
import express from 'express';
import cors from 'cors';
import path from 'path';
import { askQuestion } from './index';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/ask', async (req, res) => {
  try {
    const { documentText, question } = req.body;
    
    if (!documentText || !question) {
      return res.status(400).json({ error: 'Both documentText and question are required' });
    }

    const answer = await askQuestion(documentText, question);
    res.json({ answer });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get answer from AI model' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/test.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
