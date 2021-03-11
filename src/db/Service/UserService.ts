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

    public createUser(deviceId:string): Promise<UserModel>{
        const user = new UserModel(deviceId);
        return this.dbController.createUser(user);
    }

    public updateStats(cid: number, dur:number, userId: string){
        return this.dbController.updateUserContents(cid, dur, userId);
    }

    public updateStatus(userId: string){
        this.dbController.updateStatus(userId);
    }
}
