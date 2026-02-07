const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('invoiceApi', {
  printToPdf: () => ipcRenderer.invoke('print-to-pdf')
});
