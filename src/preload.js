
const { ipcRenderer } = require('electron');

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        ipcRenderer.send('close-window');
    }
});
