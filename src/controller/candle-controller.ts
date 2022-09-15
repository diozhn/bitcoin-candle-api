import { Candle, CandleModel } from "../models/candle-model";

export class CandleController {
  async create(candle: Candle): Promise<Candle> {
    const newCandle = await CandleModel.create(candle);

    return newCandle;
  }

  async readLastCandles(quantity: number): Promise<Candle[]> {
    const n = quantity > 0 ? quantity : 10;

    const candles: Candle[] = await CandleModel.find()
      .sort({ _id: -1 })
      .limit(n);

    return candles;
  }
}
