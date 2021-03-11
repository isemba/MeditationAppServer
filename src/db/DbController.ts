import mongoose = require("mongoose");
import {UserSchema} from "./Schema/UserSchema";
import {UserModel} from "./Model/UserModel";
import {Model} from "mongoose";
import {ContentSchema} from "./Schema/ContentSchema";
import {ContentModel, DefaultsModel, ThemeModel, UserContent} from "./Model/ContentModel";
import {DefaultsSchema} from "./Schema/DefaultsSchema";
import {ThemeSchema} from "./Schema/ThemeSchema";
import {Utils} from "../Utils";

export class DbController{
    private readonly _uri: string;

    private userModel : Model<any>;
    private contentModel : Model<any>;
    private defaultsModel : Model<any>;
    private themeModel : Model<any>;

    constructor(uri: string) {
        this._uri = uri;
    }

    public connect():Promise<boolean>{
        console.log("connecting to mongo...");
        //const ca = [fs.readFileSync( process.cwd() + "/rds-combined-ca-bundle.pem")];

        return new Promise((resolve, reject)=>{
            try {
                mongoose.set('useFindAndModify', false);

                const options = {
                    useNewUrlParser: true,
                    poolSize: 8,
                    useUnifiedTopology: true
                }

                this.userModel = mongoose.model("users", new UserSchema().schema);
                this.contentModel = mongoose.model("contents", new ContentSchema().schema);
                this.defaultsModel = mongoose.model("defaults", new DefaultsSchema().schema);
                this.themeModel = mongoose.model("themes", new ThemeSchema().schema);

                mongoose.connect(this._uri, options, err=>{
                    if(err){
                        console.log(err.message);
                        reject(err);
                    }else{
                        console.log("mongo connected!");
                        resolve(true);
                    }
                });

            }catch (e){
                console.log("mongo connection failed!!!");
                reject(e);
            }
        })
    }

    public createUser(user:UserModel):Promise<UserModel>{
       return new Promise((resolve, reject)=>{
          try {
              const model = new this.userModel(user);
              model.strike = 0;
              model.last = Date.now();
              model.contents = [];

              model.save((err, data) =>{
                  if (err) return reject(err);
                  const newUser = new UserModel(data.deviceId);
                  newUser._id = data._id.toHexString();
                  newUser.contents = [];
                  newUser.last = data.last;
                  newUser.strike = data.strike;
                  resolve(newUser);
              });
          }catch (e){
              reject(e);
          }
       });
    }

    public createContent(contentModel:ContentModel):Promise<string>{
        return new Promise((resolve, reject)=>{
            try {
                const model = new this.contentModel(contentModel);
                model.save((err, data) =>{
                    if (err) return reject(err);
                    resolve("yey");
                });
            }catch (e){
                reject(e);
            }
        });
    }

    public getUser(id:string): Promise<UserModel>{
        return new Promise((resolve, reject) => {
            try {
                this.userModel.findById(id, (err, res)=>{
                    if(err) return reject(err);

                    resolve(res);
                })
            }catch (e){
                reject(e);
            }
        });
    }

    public getUserByDevice(deviceId:string): Promise<UserModel | null>{
        return new Promise((resolve, reject) => {
            try {
                this.userModel.findOne({deviceId}, (err, res)=>{
                    if(err) return reject(err);

                    if(res == null){
                        resolve(null);
                    }else{
                        const user = new UserModel(res.deviceId);
                        user._id = res._id.toHexString();
                        user.contents = res.contents;
                        resolve(user);
                    }
                })
            }catch (e){
                reject(e);
            }
        });
    }

    public getContent(): Promise<ContentModel[]>{
        return new Promise((resolve, reject) => {
            try {
                this.contentModel.find( {}, (err, res)=>{
                    if(err) return reject(err);
                    resolve(res);
                })
            }catch (e){
                reject(e);
            }
        });
    }

    public getDefaults(): Promise<DefaultsModel>{
        return new Promise((resolve, reject) => {
            try {
                this.defaultsModel.findOne( {}, (err, res)=>{
                    if(err) return reject(err);
                    resolve(res);
                })
            }catch (e){
                reject(e);
            }
        });
    }

    public getThemes(): Promise<ThemeModel[]>{
        return new Promise((resolve, reject) => {
            try {
                this.themeModel.find( {}, (err, res)=>{
                    if(err) return reject(err);
                    resolve(res);
                })
            }catch (e){
                reject(e);
            }
        });
    }

    public async updateUserContents(cid:number, dur:number, userId:string): Promise<boolean>{
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.userModel.findOne({_id: userId});
                const contents = user.contents as UserContent[];
                const entry = {
                    cid,
                    dur,
                    time: Date.now()
                } as UserContent;

                if(contents.length > 0){
                    const last = contents[user.contents.length - 1];
                    const strike = Utils.isStrikeTime(last.time);
                    if(strike === -1){
                        user.strike = 1;
                    }else{
                        user.strike += strike;
                    }
                }else{
                    user.strike = 1;
                }

                user.contents.push(entry);
                user.save();
                resolve(true);
            }catch (e){
                reject(e);
            }
        });
    }

    public async updateStatus(userId:string){
        try {
            const user = await this.userModel.findOne({_id: userId});
            user.last = Date.now();

            const contents = user.contents as UserContent[];
            if(contents.length > 0){
                const lastTime = contents[contents.length - 1].time;
                if(Utils.isExpiredContentTime(lastTime)){
                    user.strike = 1;
                }
            }
            user.save();
        }catch (e){

        }
    }

}
