const { BrowserWindow, ipcMain, Notification } = require("electron")
const WinState = require("electron-win-state").default
const path = require("path")
const isDev = require('electron-is-dev')
const { createControlWind } = require('./createControlWindow.js')

let mainWind

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
  ipcMain.handle('user-login', async () => {
    let code = Math.floor(Math.random() * (999999 - 100000)) + 100000
    return code
  })
  ipcMain.on('request-control-screen', (e, remoteCode) => {
    mainWind.webContents.send('control-status', remoteCode, 2)
    createControlWind()
  })
}

const createWind = () => {
  const winState = new WinState({
    defaultWidth: 414,
    defaultHeight: 896
  })
  mainWind = new BrowserWindow({
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
  handleIPC(mainWind)
}
module.exports = { createWind }