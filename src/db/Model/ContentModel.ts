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
    group: GroupModel;
}

export class DefaultsModel{
    discover: string[];
    blog: string[];
    popular: string[];
    music: string[];
    moods: MoodModel[]
}

export class ThemeModel{
    name: string;
    audio: string;
    video : string;
    image: string;
}

export class MoodModel{
    title : string;
    cardId: string;
}

export class MenuItemModel{
    title: string;
    meditations: ContentModel[];
}

export class GroupModel{
    title: string;
    id: number;
}
