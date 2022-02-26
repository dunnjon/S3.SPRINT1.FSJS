/*************************
TITLE: CLI Interface
DATE: 2022-02-23
Authors: TEAM #1
File Name: app.js

SCOPE: this CLI processes arguments inputted by the user on the command line, it evalutes the input and selects the proper command. The init command when called will automatically create a folder 
structure and config file for processing and log event. The number of files created will be displayed in the console or if all files are already created, it will notify the user via console. The config 
command allows the user to display, reset or edit the apps config file while logging all events. The help command provides more info on the init and command via link
 * Commands:
app init all          creates the folder structure and config file
app init mk           creates the folder structure
app init cat          creates the config file with default settings
app config            displays a list of the current config settings
app config --reset    resets the config file with default settings
app config --set      sets a specific config setting

 *************************/
global.DEBUG = true;
const fs = require("fs");
const { initializeApp } = require("./init.js");
const { configApp } = require("./config.js");
const { help } = require("./help.js");
const { tokenApp } = require("./token.js");

// takes the args passed into the command line for evalutaion
const myArgs = process.argv.slice(2);
// console args inputted
if (DEBUG) if (myArgs.length > 1) console.log("the myapp.args: ", myArgs);
/* main switch of the app - determines the user desired command from the args passed into the command line, it then calls the appropriate function which either perfroms the command or enters another switch
to locate a subcommand of init or config. also contains a help feature for info on init or config. */
switch (myArgs[0]) {
  case "init":
    if (DEBUG) console.log(myArgs[0], " - initialize the app.");
    initializeApp();
    break;
  case "config":
  case "c":
    if (DEBUG) console.log(myArgs[0], " - display the configuration file");
    configApp();
    break;
  case "token":
  case "t":
    if (DEBUG) console.log(myArgs[0], " - User Tokens");
    tokenApp();
    break;
  case "help":
  case "h":
    console.log(
      `\n     Abbreviated as CLI, a Command Line Interface connects a user to a computer program or operating system. Through the CLI, users interact with a system or
      application by typing in text (commands). The command is typed on a specific line following a visual prompt from the computer. The system responds to the text, 
      and the user may then type on the next command line that appears. Through this command and response interaction, the user is able to issue a series of commands,
      which are executed by the system or program. Systems and software can provide users with both CLI and Graphical User Interface (GUI) option`
    );
    help();
  default:
    fs.readFile(__dirname + "/default.txt", (error, data) => {
      if (error) throw error;
      console.log(data.toString());
    });
}
