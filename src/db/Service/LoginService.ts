import {DbController} from "../DbController";
import {UserModel} from "../Model/UserModel";
import {CacheController} from "../../redis/CacheController";

export class LoginService{
    private dbController:DbController;

    constructor() {
        this.dbController = DbController.getInstance();
    }

    public getUserByDeviceId(deviceId:string): Promise<UserModel>{
        return this.dbController.getUserByDevice(deviceId);
    }

    public createUser(user:UserModel): Promise<UserModel>{
        return this.dbController.createUser(user);
    }

    public async getInitialContent(){
        const popular = await CacheController.getInstance().getPopular();
        const discover = await CacheController.getInstance().getDiscover();
        const blog = await CacheController.getInstance().getBlog();
        return { today: "today.url", popular, discover, blog };
    }
}
