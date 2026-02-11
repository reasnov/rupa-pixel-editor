const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		backgroundColor: '#1a1a1a',
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true
		}
	});

	// In development, load from the Vite dev server
	// In production, load the built index.html
	const isDev = !app.isPackaged;
	if (isDev) {
		win.loadURL('http://localhost:5173');
	} else {
		win.loadFile(path.join(__dirname, '../build/index.html'));
	}
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
