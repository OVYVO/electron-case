const { BrowserWindow } = require("electron")
const WinState = require("electron-win-state").default
const isDev = require('electron-is-dev')

let controlWind
const createControlWind = () => {
  const winState = new WinState({
    defaultWidth: 800,
    defaultHeight: 600
  })
  controlWind = new BrowserWindow({
    ...winState.winOptions,
  })
  if (isDev) {
    controlWind.loadURL('http://192.168.60.199:5175/#/control')
    controlWind.webContents.openDevTools()
  } else {
    // mainWind.loadFile()
  }
  winState.manage(controlWind)
}

module.exports = { createControlWind }