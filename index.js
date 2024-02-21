const express = require("express");
const fs = require("fs");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

/**
 * home page
 */
app.get("/", (req, res, next) => {
  res.write("<h1 style='text-align:center'>Welcome to Our Website!</h1>");
  res.write("<a href='/users'>List of users</a><br>");
  res.write("<a href='/create'>Create user</a>");
  res.end()
});

/**
 * user list page
 */
app.get("/users", (req, res, next) => {
  res.write('<html><body><a href="/">Back</a><br>');
  fs.readFile("users.txt", "utf8", (err, data) => {
    if (err) {
      res.write("Error reading the file");
      res.end();
    } else {
      // display users when file has users otherwise redirect to create route
      if (data) {
        res.write(data);
      } else {
        res.writeHead(302, { Location: "/create" });
      }
    }
    res.end();
  });
});

/**
 * create new user 
 */
app.get("/create", (req, res) => {
  console.log("create");
  res.write('<html><body><a href="/">Back</a><br>');
  res.write(
    '<form method="POST" action="/add"><input type="text"name="msg"><input type="submit"></form></body></html>'
  );
});

/**
 * add user
 */
app.post("/add", (req, res, next) => {
  console.log("add");
  console.log(req.body);
  const chunksData = [];
  chunksData.push(String(req.body.msg));
  const data = chunksData;
  
  // append data to txt file
  fs.appendFile("users.txt", data + "<br>", (err) => {
    if (err) {
      console.log(err);
      res.end("Error: Failed to append data to the file");
    } else {
      res.end();
    }
  });

  res.writeHead(302, { Location: "/" });
  res.end();
});

app.listen(5000);
