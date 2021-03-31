import {DbController} from "../DbController";
import {ContactModel} from "../Model/ContactModel";

export class ContactService {
    private dbController:DbController;

    constructor(dbController: DbController) {
        this.dbController = dbController;
    }


    public createContact(name:string, email:string, message:string): Promise<ContactModel>{
        const contact = new ContactModel(name,email,message,new Date().toISOString());
        return this.dbController.createContact(contact);
    }


}
