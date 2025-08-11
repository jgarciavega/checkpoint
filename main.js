// Hot reload solo en desarrollo
if (process.env.NODE_ENV === 'development') {
  try {
    require('electron-reload')(__dirname, {
      electron: require('electron')
    });
  } catch (e) {
    console.log('electron-reload no está instalado');
  }
}
const { app, BrowserWindow } = require('electron');
const path = require('path');


function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'src', 'assets', 'Api.png')
  });

  // Detectar entorno
  const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_START_URL;
  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, 'build', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
