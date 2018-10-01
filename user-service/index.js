const express = require('express')
const kafka = require('kafka-node')
const app = express()
const port = 3001

app.use(express.json())

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' })
const producer = new kafka.Producer(client)

producer.on('ready', () => {
  console.log('Producer is ready')
})

producer.on('error', (err) => {
  console.log('Producer is in error state')
  console.log(err)
})

app.get('/', (req, res) => res.send('Hello from user service!'))

app.post('/send-order-msg', (req, res) => {
  const msg = JSON.stringify(req.body.message);
  payloads = [
    { topic: req.body.topic, messages: msg , partition: 0 }
  ];
  producer.send(payloads, (err, data) => {
    res.json(data);
  });
})

app.listen(port, () => console.log(`User service: server listening on port ${port}!`))
