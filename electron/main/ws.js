const WebSocket = require('ws')
const EventEmitter = require('events')
const signal = new EventEmitter()

//需要实现后端代码逻辑
const ws = new WebSocket('ws:127.0.0.1:8080')

ws.on('open', () => {
  console.log('Socket连接成功')
})
ws.on('message', (msg) => {
  let data = JSON.parse(msg)
  console.log('客户端ws接收:', data)
  signal.emit(data.event, data.data)
})

const send = (event, data) => {
  console.log(`客户端发送${event}事件:`, data)
  ws.send(JSON.stringify({ event, data }))
}
const invoke = (event, data, answerEvent) => {
  return new Promise((resolve, reject) => {
    send(event, data)
    signal.once(answerEvent, resolve)
    setTimeout(() => {
      reject('超时')
    }, 5000)
  })
}

signal.send = send
signal.invoke = invoke

module.exports = signal
