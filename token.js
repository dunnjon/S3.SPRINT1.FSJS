const crc32 = require("crc/crc32");
const { format } = require("date-fns");
const fs = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");
const { main } = require("./doublylinkedlist");

//**********************************************************INITIALIZING EMMITTER*************************************************************** */
// defining and intializing events emitter. turn emmiter on to listen for event
const logEvents = require("./logEvents");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

// CONST FOR TAKING IN ARGS PASSED INTO CLI
const myArgs = process.argv.slice(2);

/**********************************************************LIST TOKENS FUNCTION *****************************
 * THIS TOKEN COUNT FUNCTION PROVIDES THE NUMBER OF TOKENS CONTAINED IN THE JSON FILE, IT IS CALLED WHEN THE USER PASSED
 * --COUNT IN THE CLI
 */
function tokenCount() {
  // read current json file
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    // console error
    if (error) throw error;
    // parse json data in file
    let tokens = JSON.parse(data);
    // count total number of tokens in file
    let count = Object.keys(tokens).length;
    // console count
    console.log(`count is ${count}`);
    // emmit event to log
    myEmitter.emit(
      "log",
      "token.tokenCount()",
      "INFO",
      `token count: ${count}`
    );
  });
}
/**********************************************************LIST TOKENS FUNCTION ******************************
 * DISPLAYS A LIST OF ALL CURRENT TOKENS IN JSON FILE, IT IS CALLED WHEN USER PASSES --COUNT INTO THE CLI. */
function listTokens() {
  // read current json file
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    // console error
    if (error) throw error;
    // parse json data in file
    let tokens = JSON.parse(data);
    // console all tokens contained in file
    tokens.forEach((obj) => console.log(`${obj.username} token: ${obj.token}`));
  });
  // emmit event to log
  myEmitter.emit(
    "log",
    "token.listTokens()",
    "INFO",
    `display full list of tokens`
  );
}
/*********************************************************ADD DAYS FUNCTION ******************************
 * THIS FUNCTION ADDS OR SUBTRACTS DAYS FROM A DATE,  IT IS CALLED IN THE NEWTOKEN FUNCTION AND USED TO DETERMINE
 * EXPIRY DATE */
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**********************************************************UPDATE TOKEN FUNCTION ******************************
 *CALLED WHEN THE USER PASSES --SET INTO THE CLI, IT UPDATES PHONE OR EMAIL OF THE TOKEN BASSED OFF THE NEXT ARG,
 IT UPDATES THE CORRESPONDING FIELD AND WRITES TO FILE  
 */
function updateToken() {
  // read current json file
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    // console error
    if (error) throw error;
    // parse json data in file
    let tokens = JSON.parse(data);
    // iterate through each token to find matching username
    tokens.forEach((obj) => {
      if (obj.username === myArgs[2]) {
        // if username is found in list, update correspond field
        switch (myArgs[3]) {
          case "p":
          case "P":
            obj.phone = myArgs[4];
            break;
          case "e":
          case "E":
            obj.email = myArgs[4];
            break;
          default:
        }
        console.log(obj);
      }
    });
    // write new json file with updated data
    userTokens = JSON.stringify(tokens);
    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
      if (err) console.log(err);
      else console.log(`Token ${myArgs[2]} updated ${myArgs[3]}`);
      // emmit event to file
      myEmitter.emit(
        "log",
        "token.updateToken()",
        "INFO",
        `updated ${myArgs[2]} : ${myArgs[3]}`
      );
    });
  });
}

/**********************************************************TOKEN SEARCH FUNCTION ******************************
 * this function creates a new token when the user passes --new and a username into the cli,
 * it creates the token structure, assigns the corresponding data for each item, reads and parses the data contained
 * in the json file and pushes the new token into the file. new token data is displayed in console
 */

// pass username from cli arg into function
function newToken(username) {
  // creating structure for new token
  let newToken = JSON.parse(`{
    "created": "2022-02-21 12:30:00",
    "username": "username",
    "token": "token",
    "phone": "phonenumber",
    "email":"emailaddress",
    "expires": "2022-02-24 12:30:00"
}`);
  // assign data to each item inside token
  let now = new Date();
  let expires = addDays(now, 3);
  newToken.created = `${format(now, "yyyy-MM-dd HH:mm:ss")}`;
  newToken.username = username;
  newToken.token = crc32(username).toString(16);
  newToken.expires = `${format(expires, "yyyy-MM-dd HH:mm:ss")}`;
  // read current token file and push new token to file
  fs.readFile(path.join(__dirname, "json", "tokens.json"), (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    tokens.push(newToken);
    userTokens = JSON.stringify(tokens);
    // write new user token to file
    fs.writeFile(
      path.join(__dirname, "json", "tokens.json"),
      userTokens,
      (err) => {
        if (err) console.log(err);
        // console new token
        else console.log(`New Token ${newToken.token} created for ${username}`);
        // emmitt event to log
        myEmitter.emit(
          "log",
          "token.newToken()",
          "INFO",
          `New token ${newToken.token}`
        );
      }
    );
  });
  console.log(newToken);
  return newToken;
}

/**********************************************************TOKEN SEARCH FUNCTION *******************************
 * THIS FUNCTION IS CALLED WHEN THE USER ENTERS THE SEARCH COMMAND, IT ROUTES THE SEARCHED BASED OFF THE ARG PASSED.
 * IF NO CASE MATCHING, DEFAULT FILE IS DISPLAYED. EVENT EMMITTED TO FILE */

function searchTokens() {
  // reading token file
  fs.readFile(path.join(__dirname, "json", "tokens.json"), (err, data) => {
    // parse the data contained in tokens.json
    const token = JSON.parse(data);
    // take inputted search criteria and pass into main token function
    main(myArgs[3]);
    // emit event to log
    myEmitter.emit(
      "log",
      "init.initializationApp()",
      "INFO",
      "invalid selection"
    );
  });
}
/**********************************************************TOKEN APP FUNCTION *******************************
 * MAIN TOKEN FUNCTION, TAKES IN THE ARGS PASSED INTO CLI AND CALLS CORRESPONDING FUNCTION FOR USERS DESIRED
 * COMMAND, IF NO MATCHES, DEFAULT FILE IS DISPLAYED
 */
function tokenApp() {
  // set arg to capture anything after the second arg
  const myArgs = process.argv.slice(2);
  if (DEBUG) console.log("tokeneApp()");
  // EMMIT EVENT TO LOG
  myEmitter.emit("log", "token.tokenApp()", "INFO", "token called by CLI");
  switch (myArgs[1]) {
    // count command displays token count and list of tokens
    case "--count":
    case "--c":
      tokenCount();
      listTokens();
      break;
    // creates new token based for username passed into cli
    case `--new`:
      newToken(myArgs[2]);
      break;
    //updates data within token
    case "--add":
      updateToken();
      break;
    // searches token list for matches to args inputted in cli
    case "--search":
      searchTokens();
      break;
    default:
      // if no cases  met, display default file
      fs.readFile(__dirname + "/default.txt", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
      myEmitter.emit(
        "log",
        "init.initializationApp()",
        "INFO",
        "invalid selection"
      );
  }
}

module.exports = { tokenApp, newToken };
