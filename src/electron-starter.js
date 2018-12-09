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
let highScoreWindow;
let levelCreationWindow;

function sendLevelData(level) {
  mainWindow.setContentSize(level.size.width, level.size.height, false);
  mainWindow.webContents.send('LEVEL_DATA', level.levelInfo);
}

function createMainWindow() {
  mainWindow = new BrowserWindow(Object.assign(LEVEL_OPTIONS.beginner.size, { useContentSize: true }));
  const baseUrl = process.env.ELECTRON_START_URL || `${__dirname}/../build/index.html`;

  mainWindow.loadURL(baseUrl);
  mainWindow.setResizable(false);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createHighScoreWindow() {
  highScoreWindow = new BrowserWindow({ width: 400, height: 250 });
  const baseUrl = process.env.ELECTRON_START_URL || `${__dirname}/../build/index.html`;

  highScoreWindow.loadURL(`${baseUrl}/highscore`);
  highScoreWindow.setResizable(false);

  highScoreWindow.on('closed', () => {
    highScoreWindow = null;
  });
}

function createLevelCreationWindow() {
  levelCreationWindow = new BrowserWindow({ width: 400, height: 250 });
  const baseUrl = process.env.ELECTRON_START_URL || `${__dirname}/../build/index.html`;

  levelCreationWindow.loadURL(`${baseUrl}/level`);
  levelCreationWindow.setResizable(false);

  levelCreationWindow.on('closed', () => {
    levelCreationWindow = null;
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
                createLevelCreationWindow();
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
            createHighScoreWindow();
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
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
