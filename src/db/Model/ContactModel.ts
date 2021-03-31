import {Types} from "mongoose";

export type ContactModel_ = {
    _id: Types.ObjectId;
    name: string;
    email: string;
    message: string;
    datestr: string;
}


export class ContactModel {

    _id: Types.ObjectId;
    name: string;
    email: string;
    message: string;
    datestr: string;

    constructor(name: string, email:string, message:string, datestr:string ) {
        this.name = name;
        this.email = email;
        this.message = message;
        this.datestr = datestr;
    }

}
