import { Schema } from "mongoose";

export class UserSchema{
    private readonly _schema;
    constructor() {
        this._schema = new Schema({
            deviceId: String,
            name: String,
            age:Number,
            contents: Array
        });
    }

    get schema() {
        return this._schema;
    }
}
