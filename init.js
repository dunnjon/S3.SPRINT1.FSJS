const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { folders, config, init } = require("./template");

//**********************************************************INITIALIZING EMMITTER*************************************************************** */
// defining and intializing events emitter. turn emmiter on to listen for event
const logEvents = require("./logEvents");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

/**********************************************************CREATE FILES FUNCTION ************************************************/
/* This function takes in the the config const from template.json, converts to a string, checks to see if a config.json file already exists in the current directory, 
if no file exists, it creates it, writes the original config data to the file and an event is emitted to log folder. Otherwise the file already exists, a message is 
displayed in console and written to log */

function createFiles() {
  if (DEBUG) console.log("init.createFiles()");
  try {
    // convert data from json to string format
    let data = JSON.stringify(config, null, 2);
    // check if file doesnt exists
    if (!fs.existsSync(path.join(__dirname, "config.json"))) {
      // create file if not and write stringified json data to it
      fs.writeFile("config.json", data, (err) => {
        if (DEBUG) console.log("DATA written to config ");
        // emit event to log folder
        myEmitter.emit(
          "log",
          "init.createFiles()",
          "INFO",
          "config folder created"
        );
      });
    } else {
      // files already exists, emit to log
      myEmitter.emit(
        "log",
        "init.createFiles()",
        "INFO",
        "config file already exists"
      );
    }
  } catch (err) {
    console.log(err);
  }
}
//**********************************************************CREATE FOLDER FUNCTION*************************************************************** */
/* This function takes each element in const folders ("models", "views", "routes", "logs") see if folder already exists, if not create it. It keeps track of the number of folders created, 
checks to see if the folder already exists in the current directory, if no folder exists, it creates it, increase the folder count and an event is emitted to the log folder. Otherwise the folder already 
exists. Any error is consoled */

// function to create folders that dont already exist
function createFolders() {
  if (DEBUG) console.log("init.createFolders()");
  // set folder created count to 0
  let mkcount = 0;
  //  parse and stringify folder names for folder creation
  const folder = JSON.parse(JSON.stringify(folders));

  folder.forEach((element) => {
    if (DEBUG) console.log(element);
    try {
      if (!fs.existsSync(path.join(__dirname, element))) {
        fsPromises.mkdir(path.join(__dirname, element));
        // increase fold created count after creation
        mkcount++;
      }
    } catch (err) {
      // console any error in processing
      console.log(err);
    }
  });
  /**********************************************************CONSOLE AND LOG TO FILE THE NUMBER OF FILES CREATED, IF ANY ******************************* */
  //  if no folders need to created - console message and emit info file to log folder
  if (mkcount === 0) {
    if (DEBUG) console.log("All folders exists");
    myEmitter.emit("log", "init.createFolder()", "INFO", "All folders exist");
  }

  //  else display the numbers of folders created and emit to log
  else if (mkcount <= folders.length) {
    if (DEBUG) console.log(mkcount + "of" + folders.length + "were created");
    myEmitter.emit(
      "log",
      "init.createFolder()",
      "INFO",
      mkcount + "of" + folders.length + "were created"
    );
  }
  // once all folders are created.
  else {
    if (DEBUG) console.log("all folders created");
    myEmitter.emit("log", "init.createFolder()", "INFO", "All folders created");
  }
}

/**********************************************************INITIALIZE APP FUNCTION *******************************
 * takes the arg after init, evaluates the arg vs cases using a switch, and calls the corresponding function. Errors are consoled and event logged
 */
function initializeApp() {
  // set arg to capture anything after the second arg
  const myArgs = process.argv.slice(2);
  if (DEBUG) console.log("initializeApp()");
  myEmitter.emit("log", "init.initializeApp()", "INFO", "init called by CLI");
  switch (myArgs[1]) {
    case "--all":
    case "--a":
      createFolders();
      createFiles();
      break;
    case "--cat":
      createFiles();
      break;
    case "--mk":
      createFolders();
      break;
    default:
      fs.readFile(__dirname + "/default.txt", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
  }
}
module.exports = { initializeApp };
