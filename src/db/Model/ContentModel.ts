import {Types} from "mongoose";

export type ContentModel = {
    _id: Types.ObjectId;
    cid: string;
    title: string;
    url: string;
    media: string;
    image:string;
    body?: string;
    desc?: string;
    group: GroupModel;
}

export type DefaultsModel = {
    discover: string[];
    blog: string[];
    popular: string[];
    music: string[];
    moods: MoodModel[]
}

export type ThemeModel = {
    name: string;
    audio: string;
    video : string;
    image: string;
}

export type MoodModel = {
    title : string;
    cardId: string;
}

export type MenuItemModel = {
    title: string;
    meditations: ContentModel[];
}

export type GroupModel = {
    title: string;
    id: number;
}

export type UserContent = {
    cid: number,
    dur: number,
    time: number;
}
