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
        const music = await CacheController.getInstance().getMusic();
        return { today: "https://i.pinimg.com/originals/29/ea/39/29ea39286147625e05117ca9e35a3889.jpg", popular, discover, blog, music };
    }
}
