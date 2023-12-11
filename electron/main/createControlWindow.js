const { BrowserWindow, desktopCapturer, ipcMain } = require("electron")
const isDev = require('electron-is-dev')
const path = require('path')

let controlWind
const createControlWind = () => {
  controlWind = new BrowserWindow({
    width: 1000,
    height: 800,
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
  handleIPC()
}

const handleIPC = () => {
  // ipcMain.handle('get-screen-sources', async () => {
  //   const sources = await desktopCapturer.getSources({ types: ['screen'] })
  //   return sources[0].id
  // })
}

const send = (channel, ...args) => {
  controlWind.webContents.send(channel, ...args)
}

module.exports = { createControlWind }