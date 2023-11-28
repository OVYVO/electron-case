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
    controlWind.loadURL('https://www.baidu.com')
  } else {
    // mainWind.loadFile()
  }
  winState.manage(controlWind)
}

module.exports = { createControlWind }