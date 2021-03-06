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

var membername
var position


let mainWindow

function createWindow () {
  // Create the browser window
  mainWindow = new BrowserWindow({width: 1000, height: 800})

  // load index.html for this app
  mainWindow.loadFile('index.html')

  // open devtools for troubleshooting
  //mainWindow.webContents.openDevTools()

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
  //console.log(ID_Number) // For DEBUGGING
  find_member(ID_Number)

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


async function get_member_data(){
  // Load client secrets from a local file.

  let creds = await getCredentials()
  let auth = await authorize(creds)
  let sheets = await create_sheets_object(auth)
  let numMembers = await getNumMembers(sheets)
  let member_data = await getIDs_and_Members(sheets, numMembers)
  return member_data
}

async function find_member(ID_Number){

  let member_data = await get_member_data()
  /*
  try {
    position = member_data[0].indexOf(ID_Number)
    if (position == -1) throw 'ID not found'
    membername = member_data[1][position]                                                // TODO: Pass the member name to the access granted page so we can display the member's name
    mainWindow.loadFile('access_granted.html')                                    // TODO: Don't load the new page from function
    //console.log(Data[1][position])
  }
  catch(err) {
    console.log(err)
    mainWindow.loadFile('access_denied.html')                                     // TODO: Don't load the new page from function
  }
  */
}

function create_sheets_object(auth){
  console.log('3')
  return google.sheets({version: 'v4', auth})
}

// ---------- Google API specific functions -------------

function getCredentials() {
    console.log('0')
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err)
    // Authorize a client with credentials, then call the Google Sheets API.
    console.log('1')
    //console.log(content)
    //console.log(JSON.stringify(JSON.parse(content)))
    return (JSON.parse(content))
  })
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @param {variable} ID_Number The ID number to check
 */
function authorize(credentials) {
  console.log('2')
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    code = '4/VwDP8YI7XzxwUluIDD5zMwqRTSbyT2zNY9O8WdIw31Aho7dXb4ndxJQ'             // TODO: Make this read the code from some other file or something
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      return oAuth2Client
    });
  });
}

//Uses test spreadsheet located here: https://docs.google.com/spreadsheets/d/1WS2hTayp4sv8GgSFPlZIr6Qq71jsu64kdvoEP_nesGI/edit#gid=0

/**
 * Creates the google sheets object and gets total number of members,
 * then calls the getIDs function
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 * @param {variable} ID_Number The entered/scanned ID number
 */

function getNumMembers(sheets) {
  console.log('4')
  sheets.spreadsheets.values.get({
    spreadsheetId: '1WS2hTayp4sv8GgSFPlZIr6Qq71jsu64kdvoEP_nesGI',
    range: 'Sheet1!G1',
    majorDimension: 'ROWS',
    valueRenderOption: 'FORMATTED_VALUE'
  }, (err, res) => {
    if (err) return console.log('The get num members API returned an error: ' + err)
    return res.data.values[0][0] // return the number of members in the spreadsheet
    //console.log(res.data.values[0][0])
  })
}

/**
 * Gets list of all members
 * @param {object} sheets The authenticated google sheets object
 * @param {variable} numMembers The total number of members
 */

function getIDs_and_Members(sheets, numMembers) {
  console.log('5')
  sheets.spreadsheets.values.get({
    spreadsheetId: '1WS2hTayp4sv8GgSFPlZIr6Qq71jsu64kdvoEP_nesGI',
    range: 'Sheet1!A1:B' + numMembers,
    majorDimension: 'COLUMNS',
    valueRenderOption: 'FORMATTED_VALUE'
  }, (err, res) => {
    if (err) return console.log('The get IDs API returned an error: ' + err)
    return res.data.values
    //console.log(res.data.values[0]) // all ID's
    //console.log(res.data.values[1]) // all members
  })
}
