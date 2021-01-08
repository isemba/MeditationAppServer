import redis = require('redis');
import util = require("util");
import {RedisClient} from "redis";
import {RedisKeys} from "./RedisKeys";
import {ContentModel} from "../db/Model/ContentModel";
import {UserModel} from "../db/Model/UserModel";

export class CacheController{
    private static INSTANCE:CacheController;
    public static init():void{
        if(this.INSTANCE == null){
            this.INSTANCE = new CacheController();
        }
    }

    public static getInstance():CacheController{
        return this.INSTANCE;
    }

    private readonly client: RedisClient;
    private readonly getAsync;
    private readonly setAsync;
    private readonly getTTLAsync;

    constructor() {
        this.client = redis.createClient();
        this.getAsync = util.promisify(this.client.get).bind(this.client);
        this.setAsync = util.promisify(this.client.set).bind(this.client);
        this.getTTLAsync = util.promisify(this.client.ttl).bind(this.client);
    }

    public getPopular(){
        return this.getAsync(RedisKeys.POPULAR_LIST);
    }

    public setPopular(list: number[]){
        const json = JSON.stringify(list);
        return this.setAsync(RedisKeys.POPULAR_LIST, json);
    }

    public getDiscover(){
        return this.getAsync(RedisKeys.DISCOVER_LIST);
    }

    public setDiscover(list: ContentModel[]){
        const json = JSON.stringify(list);
        return this.setAsync(RedisKeys.DISCOVER_LIST, json);
    }

    public getBlog(){
        return this.getAsync(RedisKeys.BLOG_LIST);
    }

    public setBlog(list: ContentModel[]){
        const json = JSON.stringify(list);
        return this.setAsync(RedisKeys.BLOG_LIST, json);
    }

    public getMusic(){
        return this.getAsync(RedisKeys.MUSIC_LIST);
    }

    public setMusic(list: ContentModel[]){
        const json = JSON.stringify(list);
        return this.setAsync(RedisKeys.MUSIC_LIST, json);
    }


}
