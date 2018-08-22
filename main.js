// Electron specific functions/methods
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

// Google API specific functions/methods
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

// Miscellaneous functions/methods
const path = require('path')

let mainWindow

function createWindow () {
  // Create the browser window
  mainWindow = new BrowserWindow({width: 1000, height: 800})

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

// Listen for message from renderer process
ipcMain.on('async', (event, ID_Number) => {
  console.log(ID_Number) // For DEBUGGING

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listMajors, ID_Number);
  });

})

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

// ---------- Google API specific functions -------------

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, ID_Number) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, ID_Number);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  //const rl = readline.createInterface({
  //  input: process.stdin,
  //  output: process.stdout,
  //});
//  rl.question('Enter the code from that page here: ', (code) => {
    //rl.close();
    code = '4/QwBLroPXE_18GmJa0J0fHQeAd9Y7M6sCVn89Bgb9xeA3JLtiOcM2bbg' // TODO: Make this read the code from some other file or something
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
//  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */

/**function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      console.log('Name, Major:');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
}
*/

//Uses test spreadsheet located here: https://docs.google.com/spreadsheets/d/1WS2hTayp4sv8GgSFPlZIr6Qq71jsu64kdvoEP_nesGI/edit#gid=0

function listMajors(auth, ID_Number) {
  const sheets = google.sheets({version: 'v4', auth});
  var name

  sheets.spreadsheets.values.update({
    spreadsheetId: '1WS2hTayp4sv8GgSFPlZIr6Qq71jsu64kdvoEP_nesGI',
    range: 'Sheet1!D2',
    valueInputOption: 'USER_ENTERED',
    resource: {range: 'Sheet1!D2',
      majorDimension: 'ROWS',
      values: [[ID_Number]]}
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
  });

  sheets.spreadsheets.values.update({
    spreadsheetId: '1WS2hTayp4sv8GgSFPlZIr6Qq71jsu64kdvoEP_nesGI',
    range: 'Sheet1!D1',
    valueInputOption: 'USER_ENTERED',
    resource: {range: 'Sheet1!D1',
      majorDimension: 'ROWS',
      values: [['=vlookup(D2,A1:B4,2,FALSE)']]}
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
  });

  name = sheets.spreadsheets.values.get({
    spreadsheetId: '1WS2hTayp4sv8GgSFPlZIr6Qq71jsu64kdvoEP_nesGI',
    range: 'Sheet1!D1',
    majorDimension: 'ROWS',
    valueRenderOption: 'FORMATTED_VALUE'
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
  });
    console.log(name)
    console.log(JSON.stringify(name, null, 2))

}
