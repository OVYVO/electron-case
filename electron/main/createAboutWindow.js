const openAboutWindow = require('about-window').default
const path = require('path')

const create = () => openAboutWindow({
  icon_path: path.join(__dirname, './trayAndMenu/icon.png'),
  package_json_dir: path.resolve(__dirname, '../../'),
  cropyright: 'Copyright (c) 2023 RyanYan',
  homepage: 'https://github.com/OVYVO/electron-case',
})

module.exports = { create }
