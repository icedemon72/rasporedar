import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import routes from './routes.js';
import connectDB from './db/db.js';

const port = parseInt(process.env.PORT) || 3001;
const host = process.env.HOST;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.listen(port, () => {
  connectDB();
  console.log(`Server running at ${host}:${port}`);
});

routes(app);