const { app, BrowserWindow, ipcMain, shell, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs');

app.setName('DOIT');
const dataFile = () => path.join(app.getPath('userData'), 'progress.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 1320,
    height: 880,
    minWidth: 980,
    minHeight: 640,
    title: 'DOIT',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 18, y: 20 },
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#121211' : '#f6f5f2',
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true },
  });

  // Every external link opens in the default browser, never inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (url.startsWith('http')) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) win.loadURL(process.env.VITE_DEV_SERVER_URL);
  else win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

ipcMain.handle('data:load', () => {
  try {
    return JSON.parse(fs.readFileSync(dataFile(), 'utf8'));
  } catch {
    return null;
  }
});

ipcMain.handle('data:save', (_e, state) => {
  const file = dataFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // Write-then-rename so a crash mid-write can't corrupt your progress.
  fs.writeFileSync(file + '.tmp', JSON.stringify(state, null, 2));
  fs.renameSync(file + '.tmp', file);
  return true;
});

ipcMain.handle('data:reveal', () => {
  if (fs.existsSync(dataFile())) shell.showItemInFolder(dataFile());
  return dataFile();
});

ipcMain.handle('theme:set', (_e, mode) => {
  nativeTheme.themeSource = mode; // 'system' | 'light' | 'dark'
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
