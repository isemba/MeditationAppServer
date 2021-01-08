import {Types} from "mongoose";

export class ContentModel{
    _id: Types.ObjectId;
    cid: string;
    title: string;
    url: string;
    media: string;
    image:string;
    body?: string;
    desc?: string;
}
