import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  const user = process.env.DB_USERNAME,
    password = process.env.DB_PASSWORD,
    name = process.env.DB_NAME,
    secret = process.env.DB_SECRET;

  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(`mongodb+srv://${user}:${password}@${name}.${secret}.mongodb.net/API?retryWrites=true&w=majority`);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.log("Error while connecting to DB!");
  }

}

export default connectDB;