import {DbController} from "../DbController";
//import {CacheController} from "../../redis/CacheController";
import {
    ContentModel,
    DefaultsModel, HistoryModel,
    MenuItemModel,
    MoodModel,
    StaticsModel,
    ThemeModel,
    UserContent
} from "../Model/ContentModel";
import {Map} from "typescript";
import {Dict, Utils} from "../../Utils";

export class ContentService{
    private dbController:DbController;

    private contents : ContentModel[];
    private contentMap : Dict<ContentModel>;
    private homeContents : {
        discover: ContentModel[],
        blog: ContentModel[],
        music: ContentModel[],
        popular: ContentModel[],
        starter: ContentModel,
        moods: ContentModel[],
        themes: ThemeModel[]
    }
    private menuFilters: {filter: string, items: MenuItemModel[]}[] = [
        {
            filter: "blog",
            items: [],
        },
        {
            filter: "music",
            items: [],
        },
        {
            filter: "video",
            items: [],
        }
    ];

    private discoverList : ContentModel[];
    private blogList : ContentModel[];
    private musicList : ContentModel[];


    constructor(dbController: DbController) {
        this.dbController = dbController;
    }

    async loadContents() {
        try {
            const contents: ContentModel[] = await this.dbController.getContent();
            const defaults: DefaultsModel = await this.dbController.getDefaults();
            const themes: ThemeModel[] = await this.dbController.getThemes();

            const discoverList : ContentModel[] = [];
            const blogList : ContentModel[] = [];
            const musicList : ContentModel[] = [];

            const homeContents = {
                discover: [],
                blog: [],
                music: [],
                popular: [],
                moods: [],
                themes,
                starter: null
            }

            contents.forEach((content, index) => {
               if (content.media == "blog"){
                   blogList.push(content);
               }else if (content.media == "music"){
                   musicList.push(content);
               }else{
                   discoverList.push(content);
               }

               if(defaults.discover.indexOf(content.cid) > -1){
                   homeContents.discover.push(content);
               }else if(defaults.blog.indexOf(content.cid) > -1){
                   homeContents.blog.push(content);
               }else if(defaults.music.indexOf(content.cid) > -1){
                  homeContents.music.push(content);
               }else if(defaults.popular.indexOf(content.cid) > -1){
                  homeContents.popular.push(content);
               }

               if(content.cid === "1"){
                   homeContents.starter = content;
               }

            });

            defaults.moods.forEach(mood => {
                const content = this.getContent(contents, mood.cardId);
                if(content){
                    const moodContent = {
                        title: mood.title,
                        url: content.url
                    } as ContentModel;
                    homeContents.moods.push(moodContent);
                }
            });

            this.contents = contents;
            this.menuFilters.forEach(menuItem => {
                menuItem.items = this.getContents(menuItem.filter);
            })
            this.homeContents = homeContents;
            this.blogList = blogList;
            this.discoverList = discoverList;
            this.musicList = musicList;
            this.contentMap = {} as Dict<ContentModel>;
            this.contents.forEach(cont => {
               this.contentMap[cont.cid] = cont;
            });


        }catch (e){
            throw new Error(e);
        }
    }

    public getContents(filter:string): MenuItemModel[]{
        const filteredContent = this.contents.filter(content => content.media === filter);
        const items: MenuItemModel[] = [];

        let lastGroupId = -1;
        const sorted = filteredContent.sort((current, next) =>  current.group.id - next.group.id );
        sorted.forEach(content =>{
            if(content.group.id > 1){
                if(lastGroupId !== content.group.id){
                    lastGroupId = content.group.id;
                    const menuItem = {
                        meditations: [content],
                        title: content.group.title
                    } as MenuItemModel;
                    items.push(menuItem);
                }else{
                    items[items.length - 1].meditations.push(content);
                }
            }


        });
        return items;
    }

    public getFilteredContents(filter:string): MenuItemModel[]{
        let shift = this.menuFilters.filter(menu => menu.filter === filter).shift();
        if(shift){
            return shift.items;
        }else{
            return null;
        }

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
            baseUrl: process.env.IMAGE_URL,
            today: this.getTodayImage(),
            popular : JSON.stringify(this.homeContents.popular),
            discover : JSON.stringify(this.homeContents.discover),
            blog : JSON.stringify(this.homeContents.blog),
            music : JSON.stringify(this.homeContents.music),
            starter: JSON.stringify(this.homeContents.starter),
            moods: JSON.stringify(this.homeContents.moods),
            themes: JSON.stringify(this.homeContents.themes)
        };
    }

    private getContent(contents: ContentModel[], cardId: string) {
        const filtered = contents.filter(cont => cont.cid === cardId);
        return filtered.shift();
    }

    public getUserStats(contents: UserContent[], max: number): StaticsModel {
        const days: string[] = [];
        let duration = 0;
        let stats = {
            totalDuration : 0,
            totalMeditations : contents.length,
            days: 0,
            strike: max,
            history: []
        } as StaticsModel;

        contents.forEach(cont =>{
           let content = this.contentMap[cont.cid];
           stats.history.push({
               title: content.title,
               time: cont.time
           } as HistoryModel);
            days.push(Utils.timeConverter(cont.time));
            duration += cont.dur;
        });

        // @ts-ignore
        const distinct = new Set(days);
        stats.days = distinct.size;
        stats.totalDuration = duration;

        return stats;
    }
}
