const express = require("express");
const bodyParser = require("body-parser");

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





app.listen(3000, ()=>{
    console.log("server has started listening on port 3000");
});