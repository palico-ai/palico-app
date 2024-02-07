import * as express from 'express'
import * as bodyParser from 'body-parser'
import { EventRouter } from './event_handlers'
import { type Application } from '../app'

export const createExpressApp = (application: Application): express.Application => {
  const app = express()
  const router = new EventRouter({ application })
  app.use(bodyParser.json())

  // Enable CORS for all methods
  app.use(function (_: unknown, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  })

  app.route('/').post(async (req: any, res: any) => {
    try {
      const response = await router.handle({
        action: req.body.action,
        payload: req.body.payload
      })
      res.status(response.statusCode).json(response.body)
    } catch (error) {
      console.error('Error in request', error)
      if (error instanceof Error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'An unknown error occurred' })
      }
    }
  })

  return app
}
