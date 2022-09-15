import { Request, Response, Router } from 'express'
import { CandleController } from '../controller/candle-controller'

export const candleRouter = Router()
const candleCtrl = new CandleController()

candleRouter.get('/last-candles/:quantity', async (req: Request, res: Response) => {
  const quantity = parseInt(req.params.quantity)
  const candles = await candleCtrl.readLastCandles(quantity)
  return res.json(candles)
})