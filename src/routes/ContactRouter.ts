import {AppRouter} from "./AppRouter";
import { Router, Response, Request } from "express";
import {StatusCodes} from "http-status-codes";
import {ContentService} from "../db/Service/ContentService";
import {Auth} from "./Auth";

export class ContactRouter extends AppRouter{
    router: Router;

    private service: ContentService;

    constructor(service: ContentService) {
        super();
        this.router = Router();
        this.service = service;

        this.addRoutes();
    }

    addRoutes(): void {
        this.router.post("/", Auth.checkToken, this.getContact.bind(this));
    }

    private async getContact(req: Request, res: Response){
        try {
            let { message } = req.body;
            if(message == null) return res.status(StatusCodes.BAD_REQUEST).send({message: "message needed!"});
            res.status(StatusCodes.OK).send({ message: "Talebinizi kaydettik teşekkür ederiz." });
        }catch (e){

        }
    }

    private getVideos(req: Request, res: Response){
        console.log(req.body);
        res.status(StatusCodes.OK).send({
            videos: ["video1", "video2"]
        });
    }

}
