const { app, BrowserWindow } = require("electron")
const path = require("path")
const WinState = require("electron-win-state").default


const createWind = () => {
  const winState = new WinState({
    defaultWidth: 1000,
    defaultHeight: 800
  })
  const mainWind = new BrowserWindow({
    ...winState.winOptions,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "../preload/index.js"),
    },
  })
  mainWind.loadURL('http://192.168.60.199:5173/')
  mainWind.webContents.openDevTools()
  winState.manage(mainWind)
}

app.whenReady().then(() => {
  createWind()
  app.on('activate', () => {
    // 此处解决mac系统关闭app后，但程序坞中还存在图标，再次点击可以重新创建进程
    if (BrowserWindow.getAllWindows.length === 0) {
      createWind()
    } else {
      BrowserWindow.getAllWindows[0].focus()
    }
  })
})

app.on('window-all-closed', () => {
  // electron 运行在三个环境（win32 Windows系统、linux Linux系统、 darwin Mac系统）
  // 此处解决的是非mac系统，程序退出进程 (Mac系统关闭app会保留在程序坞中)
  if (process.platform !== 'darwin') app.quit()
})

