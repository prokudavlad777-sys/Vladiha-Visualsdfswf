const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

Menu.setApplicationMenu(null);

function create() {
  const w = new BrowserWindow({
    width: 1280, height: 720, show: false,
    backgroundColor: '#0b3a5c', autoHideMenuBar: true,
    icon: path.join(__dirname, 'iron-war.ico'),
    webPreferences: { autoplayPolicy: 'no-user-gesture-required' }
  });
  w.once('ready-to-show', () => { w.maximize(); w.show(); });
  w.webContents.on('before-input-event', (e, i) => {
    if (i.type === 'keyDown' && i.key === 'F11') { w.setFullScreen(!w.isFullScreen()); e.preventDefault(); }
  });
  // Звуки беремо з папки sounds поруч з exe (щоб можна було міняти без перезбірки)
  const query = {};
  if (app.isPackaged) {
    const base = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath);
    query.sd = pathToFileURL(path.join(base, 'sounds')).href + '/';
  }
  w.loadFile('index.html', { query });
}

app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
