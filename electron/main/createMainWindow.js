const { BrowserWindow } = require("electron")
const path = require("path")
const isDev = require('electron-is-dev')
const { createControlWind } = require('./createControlWindow.js')

let mainWind

const createWind = () => {
  mainWind = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
    },
  })
  if (isDev) {
    mainWind.loadURL('http://localhost:5175')
    mainWind.webContents.openDevTools()
  } else {
    // mainWind.loadFile()
  }
  mainWind.once('ready-to-show', () => {
    mainWind.show()
  })
}

const send = (channel, ...args) => {
  mainWind.webContents.send(channel, ...args)
}
module.exports = { createWind, send }