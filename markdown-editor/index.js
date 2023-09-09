const { app, BrowserWindow, Menu } = require('electron')
const menu = require('./menu');
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

})
Menu.setApplicationMenu(menu);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})