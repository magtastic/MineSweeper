const { app, BrowserWindow, Menu } = require('electron');

let mainWindow;

const BORDERS_AND_PADDING_WIDTH = 18;
const TILE_WIDTH = 16;

function sendLevelData(data) {
  mainWindow.webContents.send('LEVEL_DATA', data);
}

/* 
TODO: Resize window on level change!

const WINDOW_SIZES = {
  small: {
    width: BORDERS_AND_PADDING_WIDTH + TILE_WIDTH * 9,
    height: 225,
  },
  normal: {
    width: BORDERS_AND_PADDING_WIDTH + TILE_WIDTH * 16,
    height: 225,
  },
  big: {
    width: BORDERS_AND_PADDING_WIDTH + TILE_WIDTH * 30,
    height: 225,
  },
};
 */
function createWindow() {
  mainWindow = new BrowserWindow({ width: 600, height: 600 });

  const startUrl = process.env.ELECTRON_START_URL || `${__dirname}/../build/index.html`;

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Game',
      submenu: [
        {
          label: 'New Game',
          submenu: [
            {
              label: 'Beginner',
              click: () => {
                sendLevelData({
                  rowCount: 9,
                  columnCount: 9,
                  numOfMines: 10,
                });
              }
            },
            {
              label: 'Intermediate',
              click: () => {
                sendLevelData({
                  rowCount: 16,
                  columnCount: 16,
                  numOfMines: 40,
                });
              }
            },
            {
              label: 'Advanced',
              click: () => {
                sendLevelData({
                  rowCount: 16,
                  columnCount: 30,
                  numOfMines: 99,
                });
              }
            }
          ]
        },
        {
          type: 'separator',
        },
        {
          label: 'Statistics',
          click: () => {
            scoreWindow = new BrowserWindow({ width: 400, height: 200 });
          },
        },
        {
          label: 'Options',
          click: () => {
            console.log('Option clicked...');
          },
        },
        {
          label: 'Change Appearance',
          click: () => {
            console.log('Change clicked...');
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Exit',
          role: 'close',
          click: () => {
            mainWindow.close();
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Beginner...',
        },
        {
          label: 'Something...',
        },
        {
          label: 'Else...',
        },
      ],
    },
  ]));
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
