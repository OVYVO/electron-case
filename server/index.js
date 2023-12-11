
const { WebSocketServer } = require('ws')

const wss = new WebSocketServer({ port: 8080 })
console.log('websocket服务已开启，端口8080')
const code2ws = new Map()
wss.on('connection', (ws, request, client) => {
  let code = Math.floor(Math.random() * (999999 - 100000)) + 100000
  code2ws.set(code, ws)

  ws.sendData = (event, data) => {
    ws.send(JSON.stringify({ event, data }))
  }

  ws.on('error', console.error);
  ws.on('message', (msg) => {
    let postMessage = {}
    try {
      postMessage = JSON.parse(msg)
    } catch (error) {
      console.log(error)
    }
    let { event, data } = postMessage
    if (event == 'login') {
      ws.sendData('logined', { code })
    } else if (event == 'control') {
      let remoteCode = +data.remoteCode
      if (code2ws.has(remoteCode)) {
        ws.sendData('controlled', { remoteCode })
        ws.sendRemote = code2ws.get(remoteCode).sendData
        ws.sendRemote('be-controlled', { remoteCode: code })
      }
    } else if (event == 'forward') {
      // data: {event,data}
      let remoteCode = +data.data.remoteCode
      if (code2ws.has(remoteCode)) {
        console.log('发送事件至：', remoteCode)
        ws.sendRemote = code2ws.get(remoteCode).sendData
        ws.sendRemote(data.event, data.data.res)
      }
    }
  })
})

