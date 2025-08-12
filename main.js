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
      webSecurity: false,
    },
    icon: path.join(__dirname, 'src', 'assets', 'Api.png')
  });
  // Siempre cargar la app desde localhost:3000 para acceso a cámara
  win.loadURL('http://localhost:3000');
}

// Permitir permisos de cámara/micrófono en Electron
app.on('web-contents-created', function (event, contents) {
  contents.session.setPermissionRequestHandler(function (webContents, permission, callback) {
    if (permission === 'media') {
      callback(true); // Permitir acceso a cámara/micrófono
    } else {
      callback(false);
    }
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
