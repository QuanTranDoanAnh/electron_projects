const {
    app,
    Menu,
    shell,
    ipcMain,
    BrowserWindow,
    globalShortcut,
    dialog
} = require('electron');
const fs = require('fs');

ipcMain.on('editor-reply', (_event, arg) => {
    console.log(`Received reply from web page: ${arg}`);
});
ipcMain.on('save', (_event, arg) => {
    console.log(`Saving content of the file`);
    console.log(arg);

    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Save markdown file',
        filters: [
            {
                name: 'MyFile',
                extensions: ['md']
            }
        ],
        defaultPath: app.getPath('documents') + '/test.md',
    };

    dialog.showSaveDialog(window, options).then((result) => {
        console.log(result);
        if (result && !result.canceled) {
            console.log(`Saving content to the file ${result.filePath}`);
            fs.writeFileSync(result.filePath, arg);
        }
    });

});

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator: 'CommandOrControl+O',
                click() {
                    loadFile()
                },
            },
            {
                label: 'Save',
                accelerator: 'CommandOrControl+S',
                click() {
                    saveFile()
                },
            },
        ]
    },
    {
        label: 'Format',
        submenu: [
            {
                label: 'Toggle Bold',
                accelerator: 'CommandOrControl+B',
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
                accelerator: 'CommandOrControl+I',
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
                accelerator: 'CommandOrControl+R',
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
function saveFile() {
    console.log('Saving the file');
    const window = BrowserWindow.getFocusedWindow();
    window.webContents.send('editor-event', 'save');
}

function loadFile() {
    console.log('Opening a file');

    const window = BrowserWindow.getFocusedWindow();

    const options = {
        title: 'Pick a markdown file',
        filters: [
            { name: 'Markdown files', extensions: ['md'] },
            { name: 'Text files', extensions: ['txt'] },
        ]
    };

    dialog.showOpenDialog(window, options).then((paths) => {
        console.log(paths);
        if (paths && paths.filePaths.length > 0) {
            const content = fs.readFileSync(paths.filePaths[0]).toString();
            window.webContents.send('load', content);
        }
    });
}

app.whenReady().then(() => {
    globalShortcut.register('CommandOrControl+S', () => {
        saveFile();
    });
    globalShortcut.register('CommandOrControl+O', () => {
        loadFile();
    });
});

const menu = Menu.buildFromTemplate(template);
module.exports = menu;