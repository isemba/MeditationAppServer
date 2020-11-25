import redis = require('redis');
import util = require("util");
import {RedisClient} from "redis";
import {RedisKeys} from "./RedisKeys";
import {BlogModel, DiscoverModel, PopularModel} from "../db/Model/Models";

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

    constructor() {
        this.client = redis.createClient();
        this.getAsync = util.promisify(this.client.get).bind(this.client);
        this.setAsync = util.promisify(this.client.set).bind(this.client);

        JSON.stringify([
            {title: "popular 1", url: "popular1.url", type: 0},
            {title: "popular 2", url: "popular2.url", type: 2},
            {title: "popular 3", url: "popular3.url", type: 1},
        ])
    }

    public getPopular(){
        return this.getAsync(RedisKeys.POPULAR_LIST);
    }

    public setPopular(list: PopularModel[]){
        const json = JSON.stringify(list);
        return this.setAsync(RedisKeys.POPULAR_LIST, json);
    }

    public getDiscover(){
        return this.getAsync(RedisKeys.DISCOVER_LIST);
    }

    public setDiscover(list: DiscoverModel[]){
        const json = JSON.stringify(list);
        return this.setAsync(RedisKeys.DISCOVER_LIST, json);
    }

    public getBlog(){
        return this.getAsync(RedisKeys.BLOG_LIST);
    }

    public setBlog(list: BlogModel[]){
        const json = JSON.stringify(list);
        return this.setAsync(RedisKeys.BLOG_LIST, json);
    }


}
