import { config } from "dotenv";
import { Channel, connect } from "amqplib";
import { CandleController } from "../controller/candle-controller";
import { Server } from "socket.io";
import * as http from "http";
import { Candle } from "../models/candle-model";

config();

export class CandleMessageChannel {
  private _channel: Channel;
  private _candleCtrl: CandleController;
  private _io: Server;

  constructor(server: http.Server) {
    this._candleCtrl = new CandleController();
    this._io = new Server(server, {
      cors: {
        origin: process.env.SOCKET_CLIENT_SERVER,
        methods: ["GET", "POST"],
      },
    });

    this._io.on("connection", () => {
      console.log("Web socket connection created!");
    });
  }

  private async _createMessageChannel() {
    try {
      const connection = await connect(process.env.AMQP_SERVER);
      this._channel = await connection.createChannel();
      this._channel.assertQueue(process.env.QUEUE_NAME);
    } catch (error) {
      console.log("Connection to RabbitMQ failed: ", error);
    }
  }

  async consumeMessages() {
    await this._createMessageChannel()
    if (this._channel) {
      this._channel.consume(process.env.QUEUE_NAME, async (msg) => {
        const candleObj = JSON.parse(msg.content.toString());
        console.log("Message received: \n", candleObj);
        this._channel.ack(msg);

        const candle: Candle = candleObj;
        this._candleCtrl.create(candle);
        console.log("Candle saved on database");
        this._io.emit(process.env.SOCKET_EVENT_NAME, candle);
        console.log("New candle emitted by web socket!");
      });

      console.log("Candle consumer started!");
    }
  }
}
