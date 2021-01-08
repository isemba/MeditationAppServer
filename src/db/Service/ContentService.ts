import {DbController} from "../DbController";
import {CacheController} from "../../redis/CacheController";
import {ContentModel} from "../Model/ContentModel";

export class ContentService{
    private dbController:DbController;

    private contents : ContentModel[];
    private homeContents : {
        discover: ContentModel[],
        blog: ContentModel[],
        music: ContentModel[],
        popular: ContentModel[]
    }

    private discoverList : ContentModel[];
    private blogList : ContentModel[];
    private musicList : ContentModel[];


    constructor(dbController: DbController) {
        this.dbController = dbController;
    }

    async loadContents() {
        try {
            const contents: ContentModel[] = await this.dbController.getContent();
            const cachedDiscoverList : string = await CacheController.getInstance().getDiscover();
            const cachedBlogList : string = await CacheController.getInstance().getBlog();
            const cachedMusicList : string = await CacheController.getInstance().getMusic();
            const cachedPopularList : string = await CacheController.getInstance().getPopular();

            const discoverIds = cachedDiscoverList != null ? JSON.parse(cachedDiscoverList) : ["40", "41", "36", "25", "13"];
            const blogIds = cachedBlogList != null ? JSON.parse(cachedBlogList) : ["48", "66", "51", "54", "63"];
            const musicIds = cachedMusicList != null ? JSON.parse(cachedMusicList) : ["M7", "M44", "M20", "M89", "M64"];
            const popularIds = cachedPopularList != null ? JSON.parse(cachedPopularList) : ["2", "7", "6", "53", "M7"];

            const discoverList : ContentModel[] = [];
            const blogList : ContentModel[] = [];
            const musicList : ContentModel[] = [];

            const homeContents = {
                discover: [],
                blog: [],
                music: [],
                popular: []
            }

            contents.forEach((content, index) => {
               if (content.media == "blog"){
                   blogList.push(content);
               }else if (content.media == "music"){
                   musicList.push(content);
               }else{
                   discoverList.push(content);
               }

               if(discoverIds.indexOf(content.cid) > -1){
                   homeContents.discover.push(content);
               }else if(blogIds.indexOf(content.cid) > -1){
                   homeContents.blog.push(content);
               }else if(musicIds.indexOf(content.cid) > -1){
                  homeContents.music.push(content);
               }else if(popularIds.indexOf(content.cid) > -1){
                  homeContents.popular.push(content);
               }

            });


            this.homeContents = homeContents;
            this.blogList = blogList;
            this.discoverList = discoverList;
            this.musicList = musicList;
            this.contents = contents;

        }catch (e){
            throw new Error(e);
        }
    }

    public getContents(): ContentModel[]{
        return this.contents;
    }



    private getTodayImage() : string{
        const date = new Date();
        const mount = date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        const today = `${date.getFullYear()}/${mount}/${day}.jpg`;
        return process.env.IMAGE_URL + today;
    }

    public async getInitialContent(){
        return {
            today: this.getTodayImage(),
            popular : JSON.stringify(this.homeContents.popular),
            discover : JSON.stringify(this.homeContents.discover),
            blog : JSON.stringify(this.homeContents.blog),
            music : JSON.stringify(this.homeContents.music)
        };
    }
}
