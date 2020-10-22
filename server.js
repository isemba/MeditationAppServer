const express = require("express");
const bodyParser = require("body-parser");
const env = require('dotenv');

env.config({
    path: __dirname + "/.env"
})


const app = express();

app.use(bodyParser.json());

app.get("/", (req, res)=>{
    res.send("hello!");
});

app.get("/hello/:name", (req, res)=>{
   // req.params.name
   const {name} = req.params
    res.send("hello "+name );
});


const dbUser = process.env.DDB_USER;
const dbPass = process.env.DDB_PASS;
const port = process.env.PORT || 5000;

if(!dbUser || !dbPass){
    console.error("DocumentDB DDB_USER OR DDB_PASS NOT FOUND!");
    process.exit(1);
}

app.listen(port, ()=>{
    console.log("server has started listening on port " + port);
});