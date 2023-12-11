const { ipcMain, desktopCapturer, Notification } = require("electron")
const { send: sendMainWin } = require('./createMainWindow')
const { createControlWind, send: sendControllWin } = require('./createControlWindow')
const signal = require('./ws')

const handleIPC = () => {
  /**番茄钟**/
  ipcMain.handle('timer-end', async () => {
    let notification = new Notification({
      title: '提醒',
      body: '时间到啦，请注意休息哦',
      actions: [{ text: '开始休息', type: 'button' }],
      closeButtonText: '取消'
    })
    notification.show()
    notification.on('action', () => {
      console.log('确定')
    })
    notification.on('close', () => {
      console.log('取消')
    })
  })
  /**远程控制**/
  ipcMain.handle('login', async () => {
    let { code } = await signal.invoke('login', null, 'logined')
    return code
  })
  ipcMain.handle('get-screen-sources', async () => {
    const sources = await desktopCapturer.getSources({ types: ['screen'] })
    return sources[0].id
  })
  ipcMain.on('control', (e, remoteCode) => {
    signal.send('control', { remoteCode })
  })
  signal.on('controlled', (data) => {
    createControlWind(data.remoteCode)
    sendMainWin('control-status', data.remoteCode, 1)
  })
  signal.on('be-controlled', (data) => {
    sendMainWin('control-status', data.remoteCode, 2)
  })
  /**信令传输**/
  ipcMain.on('forward', (e, event, data) => {
    signal.send('forward', { event, data })
  })
  signal.on('offer', (data) => {
    sendMainWin('offer', data)
  })
  signal.on('control-candidate', (data) => {
    sendMainWin('candidate', data)
  })
  // 傀儡端
  signal.on('answer', (data) => {
    sendControllWin('answer', data)
  })
  signal.on('puppet-candidate', (data) => {
    sendControllWin('candidate', data)
  })
}

module.exports = handleIPC