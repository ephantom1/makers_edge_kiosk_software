const electron = require('electron')

const app = electron.app

const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow () {
  // Create the browser window
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // load index.html for this app
  mainWindow.loadFile('index.html')

  // open devtools for troubleshooting
  mainWindow.webContents.openDevTools()

  // Check to see if the window has been closed
  mainWindow.on('closed', function () {

    // Dereference the window object. Need to figure out what this means
    mainWindow = null
  })
}

// Check for if Electron is finished initializing and is ready to create windows
app.on('ready', createWindow)

// Check if all windows are closed
app.on('window-all-closed', function () {
  // Check if user is not using a Mac
  if (process.platform !== 'darwin') {
    // Quit the app (note, on Macs, it is common for apps to stay active even
    // if windows are closed. User has to explicilty quit the app
    app.quit()
  }
})

// Check if user has clicked the app icon
app.on('activate', function () {
  // If no windows are open, create new window
  if (mainWindow === null) {
    createWindow()
  }
})
