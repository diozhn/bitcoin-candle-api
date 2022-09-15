import { app } from "./app";
import { config } from "dotenv";
import { handleConnection } from "./config/db";
import { connection } from "mongoose";
import { CandleMessageChannel } from "./messages/candle-message-channel";

const createServer = async () => {
  config();

  await handleConnection();

  const PORT = process.env.PORT;

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🚀`);
  });

  const candleMsgChannel = new CandleMessageChannel(server)
  await candleMsgChannel.consumeMessages()

  process.on("SIGINT", async () => {
    await connection.close();
    server.close()
    console.log('App server and connection to MongoDB closed')
  });
};

createServer();
