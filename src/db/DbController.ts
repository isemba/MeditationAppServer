import mongoose = require("mongoose");
import {UserSchema} from "./Schema/UserSchema";
import {UserModel} from "./Model/UserModel";
import {Model} from "mongoose";
import {ContentSchema} from "./Schema/ContentSchema";
import {ContentModel, DefaultsModel} from "./Model/ContentModel";
import {DefaultsSchema} from "./Schema/DefaultsSchema";

export class DbController{
    private readonly _uri: string;

    private userModel : Model<any>;
    private contentModel : Model<any>;
    private defaultsModel : Model<any>;

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
              model.save((err, data) =>{
                  if (err) return reject(err);
                  const newUser = new UserModel();
                  newUser._id = data._id.toHexString();
                  newUser.deviceId = data.deviceId;
                  newUser.name = data.name;
                  newUser.contents = [];
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
                        const user = new UserModel();
                        user._id = res._id.toHexString();
                        user.name = res.name;
                        user.deviceId = res.deviceId;


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

    public async updateUserContents(cid:number, userId:string): Promise<boolean>{
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.userModel.findOne({_id: userId});
                user.contents.push(cid);
                user.save();
                resolve(true);
            }catch (e){
                reject(e);
            }
        });
    }
}
