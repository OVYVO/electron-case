const { app, BrowserWindow, ipcMain, Notification } = require("electron")
const path = require("path")
const WinState = require("electron-win-state").default
const isDev = require('electron-is-dev')

//开发环境采用此种方式
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const createWind = () => {
  const winState = new WinState({
    defaultWidth: 414,
    defaultHeight: 896
  })
  const mainWind = new BrowserWindow({
    ...winState.winOptions,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
    },
  })
  if (isDev) {
    mainWind.loadURL('http://192.168.60.199:5175')
    mainWind.webContents.openDevTools()
  } else {
    // mainWind.loadFile()
  }
  mainWind.once('ready-to-show', () => {
    mainWind.show()
  })
  winState.manage(mainWind)

  handleIPC()
}

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

