import {DbController} from "../DbController";
import {UserModel} from "../Model/UserModel";

export class UserService {
    private dbController:DbController;

    constructor(dbController: DbController) {
        this.dbController = dbController;
    }

    public getUserByDeviceId(deviceId:string): Promise<UserModel>{
        return this.dbController.getUserByDevice(deviceId);
    }

    public createUser(user:UserModel): Promise<UserModel>{
        return this.dbController.createUser(user);
    }

    public addContent(cid: string, userId: string){
        this.dbController.updateUserContents(cid, userId);
    }
}
