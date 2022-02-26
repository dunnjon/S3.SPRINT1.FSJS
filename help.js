// install dfor user prompts
const prompt = require("prompt-sync")({ sigint: true });

/************************************HELP FUNCTION **********************************************************
 * this extra heko function is invoked when the users prompts they need more help. it sets a var to prompt the user to enter
 * if they need more info or not, takes the var into a switch statment then displays the help options (init or config) the user selects the desired
 * category then displays it
 */
function help() {
  // set const to prompt user if extra info is needed
  moreHelp = prompt("need more help? (y/n):");
  // evalute moreHelp val via switch
  switch (moreHelp) {
    case "y":
    case "Y":
    case "yes":
      helpCat = prompt("need help with init or config?");
      switch (helpCat) {
        case "init":
        case "i":
          console.log(
            `\n\n for more help with config please visit https://docs.npmjs.com/cli/v7/commands/npm-init`
          );
          break;
        case "config":
        case "c":
          console.log(
            `\n\n for more help with config please visit https://www.npmjs.com/package/config`
          );
          break;
        default:
          break;
      }
    case "n":
    case "no":
    case "N":
      break;
    default:
      break;
  }
}

module.exports = { help };
