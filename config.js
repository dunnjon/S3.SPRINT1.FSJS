const fs = require("fs");
const path = require("path");
const prompt = require("prompt-sync")({ sigint: true });
const { config } = require("./template");

//**********************************************************INITIALIZING EMMITTER*************************************************************** */
//                                      defining and intializing events emitter. turn emmiter on to listen for event
const logEvents = require("./logEvents");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

/**********************************************************FUNCTION FOR SERVING CONFIG FILE*************************************************************** 
                                                           displays current config file
*/
function serveconfig() {
  fs.readFile(__dirname + "/config.json", (error, data) => {
    if (error) throw error;
    console.log(JSON.parse(data));
  });
  myEmitter.emit("log", "config.serveConfig()", "INFO", "display config");
}

/**********************************************************FUNCTION FOR RESETTING CONFIG VALUES TO ORGINIAL***************************************************************
                   reads the current config file, parses the data and overwrites all data with the orignial, consoles any errors, and writes event to log */

function configReset() {
  //  read config values from created json file for reset
  fs.readFile(__dirname + "/config.json", (error, data) => {
    if (error) throw error;
    // parse config data and assign it cfg for calling
    let cfg = JSON.parse(data);
    //reset config file to orginial values
    cfg.name = config.name;
    cfg.description = config.description;
    cfg.version = config.version;
    cfg.main = config.main;
    cfg.superuser = config.superuser;
    console.log(cfg);
    // assign data var to config and convert to string
    data = JSON.stringify(cfg, null, 2);
    // overwrite config file with default data
    fs.writeFile(__dirname + "/config.json", data, (err) => {
      if (err) throw err;
      //   cconsole error
      console.log("config file reset");
    });
  });
  myEmitter.emit("log", "config.configReset()", "INFO", "config file reset");
}

//**********************************************************FUNCTION FOR UPDATING VALUES IN CONFIG*************************************************************** */
/* this function is called after the user selects the --set function, it displays a list of config values and prompts user to select desired value. A switch is used to 
to locate value and user is again prompted to enter updated value. Value is then written to config file and event logged*/

function configUpdate() {
  //  read config values from created json file for reset
  fs.readFile(__dirname + "/config.json", (error, data) => {
    if (error) throw error;
    // parse config data and assign it cfg for calling
    let cfg = JSON.parse(data);
    // creating a constant and prompting for user selection that can be evaluated in switch statment
    const selection = prompt(
      "enter setting you would  like to edit -- name(n), description(d), version(v), main(m), superuser(s), database(db), or enter to display :"
    );
    // evaluate inputted selection and update field accordingly
    switch (selection) {
      case "name":
      case "n":
        const name = prompt("new enter name: ");
        cfg.name = name;
        break;
      case "description":
      case "d":
        const description = prompt("new enter description: ");
        cfg.description = description;
        break;
      case "version":
      case "v":
        const version = prompt("new enter version: ");
        cfg.version = version;
        break;
      case "main":
      case "m":
        const main = prompt("new enter main: ");
        cfg.main = main;
        break;
      case "superuser":
      case "s":
        const superuser = prompt("new enter superuser: ");
        cfg.superuser = superuser;
        break;
      case "database":
      case "db":
        const database = prompt(" new enter database: ");
        cfg.database = database;
        break;
      // default is set to display the current config setting and emit event to log
      default:
        fs.readFile(__dirname + "/config.json", (error, data) => {
          if (error) throw error;
          console.log(data.toString());
        });
    }
    myEmitter.emit("log", "config.configUpdate()", "INFO", "config upate");
    console.log(cfg);
    // assign data var to config and convert to string
    data = JSON.stringify(cfg, null, 2);
    // write new data to config file
    fs.writeFile(__dirname + "/config.json", data, (err) => {
      if (err) throw err;
      //   console error
      console.log("Updated data written to file");
    });
  });
}

/**********************************************************MAIN CONFIG FUNCTION/SWITCH***************************************************************
 * takes the second arg after config to determine if the user wants to display file, overwrite file, or set a new value in the config file. The config.json
 * file is then updated with the new values and event written to log if no selection
 */
function configApp() {
  // set arg to capture anything after the second arg
  const myArgs = process.argv.slice(2);
  if (DEBUG) console.log("configApp()");
  myEmitter.emit("log", "config.configApp()", "INFO", "config called by CLI");
  switch (myArgs[1]) {
    case "--show":
    case "--s":
      serveconfig();
      break;
    case "--reset":
    case "--r":
      configReset();
      break;
    case "--set":
    case "--s":
      configUpdate();
      break;
    default:
      // default displays current config file
      fs.readFile(__dirname + "/config.json", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
  }
}

module.exports = { configApp };
