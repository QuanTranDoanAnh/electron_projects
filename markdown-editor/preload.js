const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})
contextBridge.exposeInMainWorld('electronAPI', {
  onEditorEvent: (callback) => ipcRenderer.on('editor-event', callback),
  sendEditorReply: (reply) => ipcRenderer.send('editor-reply', reply)
});