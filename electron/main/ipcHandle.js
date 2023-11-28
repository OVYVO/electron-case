const { ipcMain, Notification } = require('electron')}

const handleIPC = () => {
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
}

module.exports = { handleIPC }