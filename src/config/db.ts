import { connect } from "mongoose";
import { config } from 'dotenv'

config()

const username = encodeURIComponent(process.env.MONGODB_USERNAME as string);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD as string);
const cluster = process.env.MONGODB_CLUSTER as string;

export const handleConnection = async () => {
  try {
    await connect(
      `mongodb+srv://${username}:${password}@${cluster}.ynihyut.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Database connected! 🚀");
  } catch (err) {
    console.error("Database connection error: ", err);
  }
};
