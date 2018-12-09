const {
  app,
  BrowserWindow,
  Menu,
} = require('electron');

const BORDER_WIDTH = 2;
const BOARD_PADDING = 5;
const HEADER_PADDING = 3;
const SMILEY_HEIGHT = 26;
const TILE_WIDTH = 16;

const HEADER_HEIGHT = HEADER_PADDING * 2 + SMILEY_HEIGHT + BORDER_WIDTH * 2;

const VERTICAL_PADDING =
  BORDER_WIDTH * 4 +
  BOARD_PADDING * 2;

const HORIZONTAL_PADDING =
  VERTICAL_PADDING +
  HEADER_HEIGHT +
  BOARD_PADDING;

const LEVEL_OPTIONS = {
  beginner: {
    name: 'Beginner',
    size: {
      width: VERTICAL_PADDING + TILE_WIDTH * 9,
      height: HORIZONTAL_PADDING + TILE_WIDTH * 9,
      userContentSize: true,
    },
    levelInfo: {
      rowCount: 9,
      columnCount: 9,
      numOfMines: 10,
    }
  },
  intermediate: {
    name: 'Intermediate',
    size: {
      width: VERTICAL_PADDING + TILE_WIDTH * 16,
      height: HORIZONTAL_PADDING + TILE_WIDTH * 16,
      userContentSize: true,
    },
    levelInfo: {
      rowCount: 16,
      columnCount: 16,
      numOfMines: 40,
    }
  },
  advanced: {
    name: 'Advanced',
    size: {
      width: VERTICAL_PADDING + TILE_WIDTH * 30,
      height: HORIZONTAL_PADDING + TILE_WIDTH * 16,
      userContentSize: true,
    },
    levelInfo: {
      rowCount: 16,
      columnCount: 30,
      numOfMines: 99,
    }
  }
};

let mainWindow;
let scoreWindow;
let levelCreationWindow;

function sendLevelData(level) {
  mainWindow.setContentSize(level.size.width, level.size.height, true);
  mainWindow.webContents.send('LEVEL_DATA', level.levelInfo);
}

function createWindow() {
  mainWindow = new BrowserWindow(Object.assign(LEVEL_OPTIONS.beginner.size, { useContentSize: true }));

  const startUrl = process.env.ELECTRON_START_URL || `${__dirname}/../build/index.html`;

  mainWindow.loadURL(startUrl);
  mainWindow.setResizable(false);

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
              label: LEVEL_OPTIONS.beginner.name,
              click: () => {
                sendLevelData(LEVEL_OPTIONS.beginner);
              }
            },
            {
              label: LEVEL_OPTIONS.intermediate.name,
              click: () => {
                sendLevelData(LEVEL_OPTIONS.intermediate);
              }
            },
            {
              label: LEVEL_OPTIONS.advanced.name,
              click: () => {
                sendLevelData(LEVEL_OPTIONS.advanced);
              }
            },
            {
              type: 'separator',
            },
            {
              label: 'Custom',
              click: () => {
                levelCreationWindow = new BrowserWindow({ width: 400, height: 200 });
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
          role: 'quit',
          click: () => {
            app.quit();
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
