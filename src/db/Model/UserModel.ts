import {UserContent} from "./ContentModel";

export class UserModel{
    _id?: string;
    deviceId: string;
    contents?: UserContent [];
    last: number;
    strike: number;


    constructor(deviceId: string) {
        this.deviceId = deviceId;
    }
}
