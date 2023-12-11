const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})


// 此种直接暴露ipcRenderer的做法不推荐，仅做项目实例使用
// 推荐传递实现方法 loadPreferences: () => ipcRenderer.invoke('load-prefs')
contextBridge.exposeInMainWorld('electronAPI', {
  ipcRenderer: {
    ...ipcRenderer,
    on: ipcRenderer.on.bind(ipcRenderer),
    removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
  }
})