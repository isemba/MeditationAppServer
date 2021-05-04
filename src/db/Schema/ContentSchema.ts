import { Schema } from "mongoose";

export class ContentSchema{
    private readonly _schema;
    constructor() {
        this._schema = new Schema({
            cid: String,
            media: String,
            title: String,
            image: String,
            url: String,
            body: String,
            desc: String,
            group: Object,
            vimeo: String
        });
    }

    get schema() {
        return this._schema;
    }
}
