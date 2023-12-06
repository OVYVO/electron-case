const { ipcMain, Notification } = require("electron")
const { send: sendMainWin } = require('./createMainWindow')
const { createControlWind } = require('./createControlWindow')
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
  ipcMain.on('control', (e, remoteCode) => {
    signal.send('control', { remoteCode })
  })
  signal.on('controlled', (data) => {
    console.log('=====controlled======')
    console.log(data)
    console.log('===========')
    createControlWind()
    sendMainWin('control-status', data.remoteCode, 1)
  })
  signal.on('be-controlled', (data) => {
    console.log('=====be-controlled======')
    console.log(data)
    console.log('===========')
    sendMainWin('control-status', data.remoteCode, 2)
  })
}

module.exports = handleIPC