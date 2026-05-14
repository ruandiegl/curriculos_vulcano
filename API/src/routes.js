import express from "express"

export const router = express.Router()

router.get('/test', (req, res) => {
  console.log('rota on')
  res.send('rota func')
})