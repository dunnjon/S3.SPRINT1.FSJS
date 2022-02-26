// set const so folders can be reference using 'folders'
const folders = ["models", "views", "routes", "logs"];

//setting to display in config
const config = {
  name: "Team 1 - App config",
  version: "1.0.0",
  description: "Command Line Interface of Sprint#1 by Team#1",
  main: "app.js",
  superuser: "admin",
}; // set menu to be display on init

const init = `myapp init <command>

Usage:

myapp init --all          creates the folder structure and config file
myapp init --mk           creates the folder structure
myapp init --cat          creates the config file with default settings
myapp config --show             displays a list of the current config settings
myapp config --reset            resets the config file with default settings
myapp config --set              sets a specific config setting;
myapp token --count             displays a count of the tokens created
myapp token --new <username>    generates a token for a given username, saves tokens to the json file
myapp token --add p <username> <phone>
myapp token --add e <username> <email>
myapp token --search u <username>  fetches a token for a given username
myapp token --search e <email>  fetches a token for a given email
myapp token --search p <phone>  fetches a token for a given phone number`;

module.exports = { folders, config, init };
