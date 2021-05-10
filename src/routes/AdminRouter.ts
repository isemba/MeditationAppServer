import {AppRouter} from "./AppRouter";
import { Router, Response, Request } from "express";
import {StatusCodes} from "http-status-codes";
import {ContentService} from "../db/Service/ContentService";
import {Auth} from "./Auth";

export class AdminRouter extends AppRouter{
    router: Router;

    private service: ContentService;

    constructor(service: ContentService) {
        super();
        this.router = Router();
        this.service = service;

        this.addRoutes();
    }

    addRoutes(): void {
        this.router.post("/getlist", Auth.checkToken, this.getList.bind(this));
        this.router.post("/getcontent", Auth.checkToken, this.getContent.bind(this));
        this.router.post("/getstats", Auth.checkToken, this.getStats.bind(this));
        this.router.post("/updatecontent", Auth.checkToken, this.setContent.bind(this));
    }

    private async getList(req: Request, res: Response){
        const list = await this.service.getContentsAdmin();
        res.status(StatusCodes.ACCEPTED).send({  list });
    }

    private async getContent(req: Request, res: Response){
        const { id } = req.body;
        const list = await this.service.getContentAdmin(id);
        res.status(StatusCodes.ACCEPTED).send({  list });
    }


    private async setContent(req: Request, res: Response){
        const { id, title , cid, media, group, url, image, vimeo } = req.body;
        await this.service.setContentAdmin(id, title , cid, media, group, url, image, vimeo );
        res.status(StatusCodes.ACCEPTED).send({  "result" : "1" , "description" : "ok" });
    }


    private async getStats(req: Request, res: Response){

        const list1 = await this.service.getContentsAdmin();
        const list2 = await this.service.getUsersAdmin();
        const list3 = await this.service.getContactsAdmin();
        res.status(StatusCodes.ACCEPTED).send({  "l1" : list1.length , "l2" : list2.length , "l3" : list3.length });
    }


}
