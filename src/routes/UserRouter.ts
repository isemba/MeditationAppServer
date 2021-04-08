import {AppRouter} from "./AppRouter";
import { Router, Request, Response } from "express";
import {StatusCodes} from "http-status-codes";
import {ContentService} from "../db/Service/ContentService";
import {UserModel} from "../db/Model/UserModel";
import {Auth} from "./Auth";
import {UserService} from "../db/Service/UserService";
import {StaticsModel} from "../db/Model/ContentModel";

export class UserRouter extends AppRouter{
    router: Router;
    private userService: UserService;
    private contentService: ContentService;


    constructor(userService: UserService, contentService: ContentService) {
        super();
        this.router = Router();
        this.userService = userService;
        this.contentService = contentService;
        this.router.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        });

        this.addRoutes();

    }

    addRoutes(): void {
        this.router.post("/login", this.login.bind(this));
        this.router.post("/update", Auth.checkToken, this.updateStats.bind(this));
    }

    private async login(req: Request, res: Response){
        const { deviceId } = req.body;

        try {
            if(deviceId == null){
                return res.status(StatusCodes.SERVICE_UNAVAILABLE).send({message: "Bir hata oluştu!"});
            }

            const user : UserModel | null = await this.userService.getUserByDeviceId(deviceId);
            const initial = await this.contentService.getInitialContent();
            if(user == null){
                try {
                    const created = await this.userService.createUser(deviceId);
                    const token = this.getToken(deviceId, created._id);

                    const stats = {
                        days: 0,
                        totalDuration: 0,
                        totalMeditations: 0,
                        history: [],
                        strike: 1
                    } as StaticsModel;
                    res.status(StatusCodes.CREATED).send({ token, initial, stats });
                }catch (e){
                    console.error(e.message);
                    res.status(StatusCodes.SERVICE_UNAVAILABLE).send({message: "Bir hata oluştu!"});
                }

            }else{
                const token = this.getToken(deviceId, user._id);
                const stats = this.contentService.getUserStats(user.contents, user.maxStrike);
                this.userService.updateStatus(user._id);
                res.status(StatusCodes.ACCEPTED).send({ token, initial, stats });
            }

        }catch (e){
            console.error(e);
            res.status(StatusCodes.SERVICE_UNAVAILABLE).send({message: "Bir hata oluştu! !"});
        }
    }

    private getToken(deviceId, id):string{
        const payload = { deviceId, id, at: Date.now() }
        const json = JSON.stringify(payload);
        return Auth.getEncrypt(json);
    }

    private async updateStats(req: Request, res: Response){
        const { cid, dur, session } = req.body;
        if(!cid || !dur) return res.status(StatusCodes.BAD_REQUEST).send("Eksik parametre!");

        try {
            await this.userService.updateStats(cid, dur, session.id);
            res.status(StatusCodes.OK).send({status: "güncellendi!"});
        }catch (e){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Bir hata oluştu!");
        }
    }

}
