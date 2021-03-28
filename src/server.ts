import express = require('express');
import bodyParser = require("body-parser");
import env = require('dotenv');
import { UserRouter } from "./routes/UserRouter";
import { DbController } from "./db/DbController";
import { ContentRouter } from "./routes/ContentRouter";
import { ContactRouter } from "./routes/ContactRouter";
import { Auth } from "./routes/Auth";
//import {CacheController} from "./redis/CacheController";
import {ContentService} from "./db/Service/ContentService";
import {UserService} from "./db/Service/UserService";

env.config({
    path: process.cwd() + "/.env"
})

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/meditation';
const secretKey: string = process.env.SECRET_KEY || "test.key";
const port: number = Number(process.env.PORT) || 5000;



const app = express();

(async ()=>{
    try {
        Auth.init(secretKey);
        const dbController = new DbController(mongoURI);
        await dbController.connect();
        //CacheController.init();

        const contentService = new ContentService(dbController);
        await contentService.loadContents();

        const userService = new UserService(dbController);

        app.use(bodyParser.json());
        app.use("/user", new UserRouter(userService, contentService).router);
        app.use("/content", new ContentRouter(contentService).router);
        app.use("/contact", new ContactRouter(contentService).router);


        app.listen(port, (): void => {
            console.log("server has started listening on port " + port);
        });
    }catch (e){
        console.error("Server CAN NOT started", e.message);
    }
})();
