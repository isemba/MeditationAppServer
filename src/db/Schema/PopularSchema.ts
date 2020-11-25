import { Schema } from "mongoose";

export class PopularSchema{
    private readonly _schema;
    constructor() {
        this._schema = new Schema({
            title: String,
            type: Number,
            url:String
        });
    }

    get schema() {
        return this._schema;
    }
}
