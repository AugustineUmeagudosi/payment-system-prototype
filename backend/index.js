import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import './config/db_connection';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  return res.send('working!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
