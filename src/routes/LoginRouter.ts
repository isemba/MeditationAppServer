import {AppRouter} from "./AppRouter";
import { Router, Request, Response } from "express";
import {StatusCodes} from "http-status-codes";
import {LoginService} from "../db/Service/LoginService";
import {UserModel} from "../db/Model/UserModel";
import {Auth} from "./Auth";


export class LoginRouter extends AppRouter{
    router: Router;
    private service: LoginService;

    constructor() {
        super();
        this.router = Router();
        this.service = new LoginService();
        this.router.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        });

        this.addRoutes();
    }

    addRoutes(): void {
        this.router.post("/", this.login.bind(this));
    }

    private async login(req: Request, res: Response){
        const { name, deviceId } = req.body;

        try {
            const user : UserModel | null = await this.service.getUserByDeviceId(deviceId);
            const initial = await this.service.getInitialContent();
            if(user == null){
                try {
                    const created = await this.service.createUser({name, deviceId});
                    const token = this.getToken(name, deviceId, created._id);

                    res.status(StatusCodes.CREATED).send({ token, initial });
                }catch (e){
                    console.error(e.message);
                    res.status(StatusCodes.SERVICE_UNAVAILABLE).send({message: "Bir hata oluştu!"});
                }

            }else{
                const token = this.getToken(name, deviceId, user._id);
                res.status(StatusCodes.ACCEPTED).send({ token, initial });
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





}
