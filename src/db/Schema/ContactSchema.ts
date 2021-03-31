import { Schema } from "mongoose";

export class ContactSchema{
    private readonly _schema;
    constructor() {
        this._schema = new Schema({
            name: String,
            email: String,
            message: String,
            datestr: String
        });
    }

    get schema() {
        return this._schema;
    }
}
