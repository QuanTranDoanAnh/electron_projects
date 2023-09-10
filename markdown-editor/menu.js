const {
    app,
    Menu,
    shell,
    ipcMain,
    BrowserWindow
} = require('electron');

ipcMain.on('editor-reply', (_event, arg) => {
    console.log(`Received reply from web page: ${arg}`);
});

const template = [
    {
        label: 'Format',
        submenu: [
            {
                label: 'Toggle Bold',
                accelerator: 'Ctrl+B',
                click() {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send(
                        'editor-event',
                        'toggle-bold'
                    )
                }
            },
            {
                label: 'Toggle Italic',
                accelerator: 'Ctrl+I',
                click() {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send(
                        'editor-event',
                        'toggle-italic'
                    )
                }
            },
            {
                label: 'Toggle Strikethrough',
                accelerator: 'Ctrl+R',
                click() {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send(
                        'editor-event',
                        'toggle-strikethrough'
                    )
                }
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'About Editor Component',
                click() {
                    shell.openExternal('https://simplemde.com/');
                }

            }
        ]
    }
];
if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    })
}
if (process.env.DEBUG) {
    template.push(
        {
            label: 'Debugging',
            submenu: [
                {
                    label: 'Dev Tools',
                    role: 'toggleDevTools'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'reload',
                    accelerator: 'Alt+R'
                }
            ]
        })
}

const menu = Menu.buildFromTemplate(template);
module.exports = menu;