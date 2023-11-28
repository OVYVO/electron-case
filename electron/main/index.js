const { app } = require("electron")
const { createWind } = require('./createMainWindow')

//开发环境采用此种方式
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.whenReady().then(() => {
  createWind()
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows.length === 0) {
    createWind()
  } else {
    BrowserWindow.getAllWindows[0].focus()
  }
})
app.on('window-all-closed', () => {
  // electron 运行在三个环境（win32 Windows系统、linux Linux系统、 darwin Mac系统）
  // 此处解决的是非mac系统，程序退出进程 (Mac系统关闭app会保留在程序坞中)
  if (process.platform !== 'darwin') app.quit()
})

