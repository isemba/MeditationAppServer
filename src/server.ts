import express = require('express');
import bodyParser = require("body-parser");
import env = require('dotenv');
import { LoginRouter } from "./routes/LoginRouter";
import { DbController } from "./db/DbController";
import { ContentRouter } from "./routes/ContentRouter";
import { Auth } from "./routes/Auth";
import {CacheController} from "./redis/CacheController";

env.config({
    path: process.cwd() + "/.env"
})

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/meditation';
const jwtSecret: string = process.env.JWT_SECRET;
const port: number = Number(process.env.PORT) || 5000;

Auth.init(jwtSecret);
DbController.init(mongoURI);
CacheController.init();

const app = express();

app.use(bodyParser.json());
app.use("/login", new LoginRouter().router);
app.use("/content", new ContentRouter().router);


app.listen(port, (): void => {
    console.log("server has started listening on port " + port);
});
