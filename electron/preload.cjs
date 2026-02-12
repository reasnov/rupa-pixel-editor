const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	saveFile: (content, defaultPath) => ipcRenderer.invoke('dialog:saveFile', content, defaultPath),
	openFile: () => ipcRenderer.invoke('dialog:openFile'),
	autoSave: (content) => ipcRenderer.invoke('file:autoSave', content)
});
