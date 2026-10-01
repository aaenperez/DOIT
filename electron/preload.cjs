const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('doit', {
  load: () => ipcRenderer.invoke('data:load'),
  save: (state) => ipcRenderer.invoke('data:save', state),
  reveal: () => ipcRenderer.invoke('data:reveal'),
  setTheme: (mode) => ipcRenderer.invoke('theme:set', mode),
});
