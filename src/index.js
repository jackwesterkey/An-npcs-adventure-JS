const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

try {
    require('electron-reloader')(module);
} catch (_) {}

function createWindow() {
    const win = new BrowserWindow({
        width: 1680,
        height: 1050,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
        resizable: false,
        icon: path.join(__dirname, './assets/icon.ico'), // Add the icon path
        fullscreen: true // Set the window to fullscreen
    });

    // Uncomment this when the game is finished
    // win.removeMenu()
  
    // Load index.html directly from C:\Users\dudle\Desktop\JS - Copy
    win.loadFile(path.join(__dirname, '..', 'index.html'));

    // Listen for the close-window message
    ipcMain.on('close-window', () => {
        win.close();
    });
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
