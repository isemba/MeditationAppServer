import { Schema } from "mongoose";

export class ThemeSchema{
    private readonly _schema;
    constructor() {
        this._schema = new Schema({
            image: String,
            name: String,
            audio: String,
            video: String
        });
    }

    get schema() {
        return this._schema;
    }
}
