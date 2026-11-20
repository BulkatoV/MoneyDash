import { fileURLToPath } from 'node:url'

import express from 'express'

const app = express()
const host = '127.0.0.1'
const port = 3000
const webRoot = fileURLToPath(new URL('../dist/', import.meta.url))

app.use('/api', (_request, response) => {
  response.status(404).json({ message: 'Эндпоинт не найден' })
})
app.use(express.static(webRoot))
app.get('/{*path}', (_request, response) => {
  response.sendFile('index.html', { root: webRoot })
})
app.listen(port, host, () => console.log(`MoneyDash: http://${host}:${port}`))
