const { BrowserWindow, desktopCapturer, ipcMain } = require("electron")
const WinState = require("electron-win-state").default
const isDev = require('electron-is-dev')
const path = require('path')



let controlWind
const createControlWind = () => {
  const winState = new WinState({
    defaultWidth: 300,
    defaultHeight: 600
  })
  controlWind = new BrowserWindow({
    ...winState.winOptions,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
    },
  })
  if (isDev) {
    controlWind.loadURL('http://localhost:5175/#/control')
    controlWind.webContents.openDevTools()
  } else {
    // mainWind.loadFile()
  }
  winState.manage(controlWind)
  handleIPC()
}

const handleIPC = () => {
  ipcMain.handle('get-screen-sources', async () => {
    const sources = await desktopCapturer.getSources({ types: ['screen'] })
    return sources[0].id
  })
}

module.exports = { createControlWind }