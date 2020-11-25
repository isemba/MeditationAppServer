import {AppRouter} from "./AppRouter";
import { Router, Response, Request } from "express";
import {StatusCodes} from "http-status-codes";
import {Auth} from "./Auth";

export class ContentRouter extends AppRouter{
    router: Router;

    constructor() {
        super();
        this.router = Router();

        this.addRoutes();
    }

    addRoutes(): void {
        this.router.get("/videos", this.getVideosInfo);
        //this.router.post("/videos", Auth.checkToken, this.getVideos);
    }

    private getVideosInfo(req: Request, res: Response){
        res.status(StatusCodes.OK).send({
            info : "There is 2 video content",
            size: 2
        });
    }

    private getVideos(req: Request, res: Response){
        console.log(req.body);
        res.status(StatusCodes.OK).send({
            videos: ["video1", "video2"]
        });
    }

}
