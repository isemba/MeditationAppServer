import express = require('express');
import bodyParser = require("body-parser");
import env = require('dotenv');
import { UserRouter } from "./routes/UserRouter";
import { DbController } from "./db/DbController";
import { ContentRouter } from "./routes/ContentRouter";
import { ContactRouter } from "./routes/ContactRouter";
import { AdminRouter } from "./routes/AdminRouter";
import { Auth } from "./routes/Auth";
//import {CacheController} from "./redis/CacheController";
import {ContentService} from "./db/Service/ContentService";
import {UserService} from "./db/Service/UserService";
import {ContactService} from "./db/Service/ContactService";

env.config({
    path: process.cwd() + "/.env"
})

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/meditation';
const secretKey: string = process.env.SECRET_KEY || "test.key";
const port: number = Number(process.env.PORT) || 3000;



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
        const contactService = new ContactService(dbController);

        app.use(bodyParser.json());
        app.use('/adminpanel', express.static('public'))
        app.use("/admin", new AdminRouter(contentService).router);
        app.use("/user", new UserRouter(userService, contentService).router);
        app.use("/content", new ContentRouter(contentService).router);
        app.use("/contact", new ContactRouter(contactService).router);


        app.listen(port, (): void => {
            console.log("server has started listening on port " + port);
        });
    }catch (e){
        console.error("Server CAN NOT started", e.message);
    }
})();
