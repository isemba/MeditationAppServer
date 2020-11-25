import mongoose = require("mongoose");
import {UserSchema} from "./Schema/UserSchema";
import {UserModel} from "./Model/UserModel";
import {Model, Promise} from "mongoose";
import {PopularSchema} from "./Schema/PopularSchema";

export class DbController{
    private readonly _uri: string;

    private static instance: DbController;
    public static getInstance():DbController{
        return this.instance;
    }
    public static init(uri:string){
        if(this.instance == null){
            this.instance = new DbController(uri)
        }
    }

    private static userModel : Model<any>;
    private static popularModel : Model<any>;


    constructor(uri: string) {

        this._uri = uri;
        console.log("uri: ", uri);
        this.connect();
        //const ca = [fs.readFileSync( process.cwd() + "/rds-combined-ca-bundle.pem")];

    }

    private connect(){
        console.log("connecting to mongo...");

        try {
            mongoose.set('useFindAndModify', false);

            const options = {
                useNewUrlParser: true,
                poolSize: 8,
                useUnifiedTopology: true
            }

            mongoose.connect(this._uri, options, err=>{
                if(err){
                    console.log(err.message);
                }else{
                    console.log("mongo connected!");
                }
            });

            DbController.userModel = mongoose.model("users", new UserSchema().schema);
            DbController.popularModel = mongoose.model("popular", new PopularSchema().schema);

        }catch (e){
            console.log("mongo connection failed!!!");
        }
    }

    public createUser(user:UserModel):Promise<UserModel>{
       return new Promise((resolve, reject)=>{
          try {
              const model = new DbController.userModel(user);
              model.save((err, data) =>{
                  if (err) return reject(err);
                  const newUser = new UserModel();
                  newUser._id = data._id.toHexString();
                  newUser.deviceId = data.deviceId;
                  newUser.name = data.name;
                  resolve(newUser);
              });
          }catch (e){
              reject(e);
          }
       });
    }

    public getUser(id:string): Promise<UserModel>{
        return new Promise((resolve, reject) => {
            try {
                DbController.userModel.findById(id, (err, res)=>{
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
                DbController.userModel.findOne({deviceId}, (err, res)=>{
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
}
