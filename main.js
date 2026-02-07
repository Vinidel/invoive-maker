const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    title: 'Gerador de Orçamentos',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('renderer.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('print-to-pdf', async (_event) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return { ok: false, error: 'No active window' };

  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: 'Salvar Orçamento em PDF',
    defaultPath: 'orcamento.pdf',
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });

  if (canceled || !filePath) {
    return { ok: false, error: 'Canceled' };
  }

  try {
    const pdfData = await win.webContents.printToPDF({
      marginsType: 1,
      printBackground: true,
      pageSize: 'A4'
    });

    fs.writeFileSync(filePath, pdfData);
    return { ok: true, filePath };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});
