const { app, BrowserWindow } = require('electron');
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
    });

    // Uncomment this when the game is finished
    // win.removeMenu()
  
    // Load index.html directly from C:\Users\dudle\Desktop\JS - Copy
    win.loadFile(path.join(__dirname, '..', 'index.html'));
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
