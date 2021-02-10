import {AppRouter} from "./AppRouter";
import { Router, Request, Response } from "express";
import {StatusCodes} from "http-status-codes";
import {ContentService} from "../db/Service/ContentService";
import {UserModel} from "../db/Model/UserModel";
import {Auth} from "./Auth";
import {UserService} from "../db/Service/UserService";

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
        const { name, deviceId } = req.body;

        try {
            if(name == null || deviceId == null){
                return res.status(StatusCodes.SERVICE_UNAVAILABLE).send({message: "Bir hata oluştu!"});
            }

            const user : UserModel | null = await this.userService.getUserByDeviceId(deviceId);
            const initial = await this.contentService.getInitialContent();
            if(user == null){
                try {
                    const created = await this.userService.createUser({name, deviceId});
                    const token = this.getToken(name, deviceId, created._id);

                    const stats = {
                        days: 1,
                        totalDuration: 0,
                        totalMeditations: 0
                    };
                    res.status(StatusCodes.CREATED).send({ token, initial, stats });
                }catch (e){
                    console.error(e.message);
                    res.status(StatusCodes.SERVICE_UNAVAILABLE).send({message: "Bir hata oluştu!"});
                }

            }else{
                const token = this.getToken(name, deviceId, user._id);
                const stats = {
                    days: 3,
                    totalDuration: 30,
                    totalMeditations: 4
                };
                res.status(StatusCodes.ACCEPTED).send({ token, initial, stats });
            }

        }catch (e){
            console.error(e.message);
            res.status(StatusCodes.SERVICE_UNAVAILABLE).send({message: "Bir hata oluştu!"});
        }
    }

    private getToken(name, deviceId, id):string{
        const payload = { name, deviceId, id, at: Date.now() }
        const json = JSON.stringify(payload);
        return Auth.getEncrypt(json);
    }

    private async updateStats(req: Request, res: Response){
        const { cid, session } = req.body;
        try {
            await this.userService.updateStats(cid, session.id);
            res.status(StatusCodes.OK).send({status: "güncellendi!"});
        }catch (e){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Bir hata oluştu!");
        }
    }

}
