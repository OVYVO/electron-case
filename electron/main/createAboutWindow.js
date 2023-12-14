const openAboutWindow = require('about-window').default
const path = require('path')

const create = () => openAboutWindow({
  icon_path: path.join(__dirname, 'icon.png'),
  package_json_dir: path.resolve(__dirname, '/../../'),
  cropyright: 'Copyright (c) 2023 yan',
  homepage: 'https://github.com/',
})

module.exports = { create }
