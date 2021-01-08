import {AppRouter} from "./AppRouter";
import { Router, Response, Request } from "express";
import {StatusCodes} from "http-status-codes";
import {ContentService} from "../db/Service/ContentService";
import {Auth} from "./Auth";

export class ContentRouter extends AppRouter{
    router: Router;

    private service: ContentService;

    constructor(service: ContentService) {
        super();
        this.router = Router();
        this.service = service;

        this.addRoutes();
    }

    addRoutes(): void {
        this.router.post("/", Auth.checkToken, this.getVideosInfo.bind(this));
    }

    private async getVideosInfo(req: Request, res: Response){
        try {
            let content = this.service.getContents();
            res.status(StatusCodes.OK).send(content);
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
