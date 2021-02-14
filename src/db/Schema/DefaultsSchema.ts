import { Schema } from "mongoose";

export class DefaultsSchema{
    private readonly _schema;
    constructor() {
        this._schema = new Schema({
            discover: Array,
            blog : Array,
            music : Array,
            popular: Array,
            moods: Array
        });
    }

    get schema() {
        return this._schema;
    }
}
