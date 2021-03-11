import { Schema } from "mongoose";

export class UserSchema{
    private readonly _schema;
    constructor() {
        this._schema = new Schema({
            deviceId: String,
            age:Number,
            contents: Array,
            strike: Number,
            last: Number
        });
    }

    get schema() {
        return this._schema;
    }
}
