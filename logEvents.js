/********************** EVENT EMMITER ********************************
 THIS ASYNC LOG FUNCTION TAKES 2 PARAMETERS (MESSAGE, LOGNAME). IT CAPTURES THE DATE AND TIME THAT AN EVENT WAS EMMITED, FORMATS IT, 
 THEN CONCANTENATES THE DATE/TIME TO THE REQ URL AND REQ METHOD, IT THEN STORES IT IN A CONSTANT CALLED LOGITEM. LOGITEM IS FIRST WRITTEN 
 TO THE CONSOLE, THEN FILESYSTEM PROMISES ARE CALLED TO DETERMINE IF THE LOGS FOLDER AND FILE NEED TO BE CREATED, IF SO, BOTH ARE CREATED 
 AND DATA APPENDED. IF ERROR OCCURS DURING PROCESS, ERR MESSAGE IS WRITTEN TO CONSOLE. FUNCTION THEN EXPORTED INTO SERVER.JS ****************/

//import date formatting
const { format } = require("date-fns");
//generates random number for log event
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (msg, logName, event, level) => {
  //create const for date/time and format
  const dateTime = `${format(new Date(), "yyyMMdd\tHH:mm:ss")}`;
  //create const logItem to store the data we want in the log.txt file and console
  const logItem = `${dateTime}\t${event}\t${msg}\n`;
  console.log(logItem);
  try {
    // if log folder doesnt already exists
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      // create folder
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }
    // append file to folder and add logitem
    await fsPromises.appendFile(path.join(__dirname, "logs", logName), logItem);
    // if error occurs, console log error
  } catch (err) {
    console.log(err);
  }
};
// export function
module.exports = logEvents;
