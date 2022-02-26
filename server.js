const http = require("http");
const { parse } = require("querystring");
const { newToken } = require("./token");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    // collect data from post request. request goes in, produces result
    collectRequestData(req, (result) => {
      var theToken = newToken(result.username);
      fs.readFile(path.join(__dirname, "json", "tokens.json"), (err, data) => {
        console.log(
          `Trying to parse the following DATA: ${data}\n Data has TYPE: ${typeof data}`
        );
        const token = JSON.parse(data);
        console.log(token);
        res.end(` ${result.username} token number: ${theToken.token}`);
      });
    });
  } else {
    res.end(`
            <!doctype html>
            <html>w
            <body>
                <form action="/" method="post">
                    <span>Enter Username:<span><input type="text" name="username" /><br />
                    <button>Generate new token</button>
                </form>
            </body>
            </html>
        `);
  }
});
server.listen(3000);

function collectRequestData(request, callback) {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";
  if (request.headers["content-type"] === FORM_URLENCODED) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(parse(body));
    });
  } else {
    callback(null);
  }
}
