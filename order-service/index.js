const express = require('express')
const kafka = require('kafka-node')
const app = express()
const port = 3000

app.use(express.json())

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' })
const consumer = new kafka.Consumer(client,
  [
    { topic: 'order.create', offset: 0 }
  ],
  // Set this to false and manually commit if you always want
  // to receive the last message when the service restarts.
  { autoCommit: true }
)

const messages = []
consumer.on('message', (message) => {
  console.log(message)
  messages.push(message)
  // consumer.commit((err, data) => {
  //   console.log('Manually committing topic')
  //   console.log(data)
  // })
})

consumer.on('error', (err) => {
  console.log('Error:', err)
})

consumer.on('offsetOutOfRange', (err) => {
  console.log('offsetOutOfRange:', err)
})

app.get('/', (req, res) => res.send('Hello from order service!'))
app.get('/messages', (req, res) => res.send(messages))

app.listen(port, () => console.log(`Order service: server listening on port ${port}!`))
