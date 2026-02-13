const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		backgroundColor: '#fdf6e3',
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.cjs')
		}
	});

	// In development, load from the Vite dev server with retry logic
	const isDev = !app.isPackaged;
	if (isDev) {
		const loadDevServer = () => {
			win.loadURL('http://localhost:5173').catch(() => {
				console.log('Vite not ready, retrying in 1s...');
				setTimeout(loadDevServer, 1000);
			});
		};
		loadDevServer();
	} else {
		win.loadFile(path.join(__dirname, '../build/index.html'));
	}
}

// IPC Handlers for Persistence
ipcMain.handle('dialog:saveFile', async (event, content, defaultPath) => {
	const { filePath, canceled } = await dialog.showSaveDialog({
		title: 'Save Artisan Project',
		defaultPath: defaultPath || 'untitled.rupa',
		filters: [{ name: 'Rupa Project', extensions: ['rupa'] }]
	});

	if (!canceled && filePath) {
		fs.writeFileSync(filePath, content);
		return filePath;
	}
	return null;
});

ipcMain.handle('dialog:openFile', async () => {
	const { filePaths, canceled } = await dialog.showOpenDialog({
		title: 'Open Artisan Project',
		filters: [{ name: 'Rupa Project', extensions: ['rupa'] }],
		properties: ['openFile']
	});

	if (!canceled && filePaths.length > 0) {
		const content = fs.readFileSync(filePaths[0], 'utf-8');
		return { content, filePath: filePaths[0] };
	}
	return null;
});

ipcMain.handle('file:autoSave', async (event, content) => {
	const userDataPath = app.getPath('userData');
	const backupPath = path.join(userDataPath, 'temp_backup.rupa');
	fs.writeFileSync(backupPath, content);
	return backupPath;
});

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
