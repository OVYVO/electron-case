const { ipcMain, Notification } = require('electron')

const handleIPC = (mainWind) => {
  console.log('==========')
  console.log(mainWind)
  console.log('==========')
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
  ipcMain.handle('user-login', async () => {
    let code = Math.floor(Math.random() * (999999 - 100000)) + 100000
    return code
  })
  ipcMain.on('request-control-screen', (e, remoteCode) => {
    console.log(remoteCode)
    mainWind.webContents.send('control-status', remoteCode, 1)
    //TODO: 服务端代码
    //sendMainWindow('control-status', remoteCode, 1)
    // createControlWindow()
  })
}

module.exports = { handleIPC }