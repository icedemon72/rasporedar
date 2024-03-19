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

// // Simulating 1s delay
// app.use(function(req,res,next){
//   setTimeout(next, 1000)
// });

app.listen(port, () => {
  connectDB();
  console.log(`Server running at ${host}:${port}`);
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      const formattedError = {
          status: 400,
          message: err.message,
      };
      return res.status(400).json(formattedError);
  }
  next();
});

routes(app);