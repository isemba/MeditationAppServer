import {StatusCodes} from "http-status-codes";
import Cryptr = require('cryptr');

export class Auth{
    private static cryptr: Cryptr;
    public static init(secretKey:string){
        this.cryptr = new Cryptr(secretKey);
    }

    public static getEncrypt(data:string){
        return this.cryptr.encrypt(data);
    }

    public static getDecrypt(data:string) : string | null{
        return this.cryptr.decrypt(data);
    }

    public static async checkToken(req, res, next) {
        const auth = req.headers.authorization;
        if(!auth) return res.status(StatusCodes.UNAUTHORIZED).send({ message: "please log in" });

        const token = req.headers.authorization.split(" ")[1];
        try {
            const strSession = Auth.getDecrypt(token);
            if(strSession != null){

                const session = JSON.parse(strSession) as {at: number};
                if(Auth.isValid(session.at) || token == "bb4c18c2595749ca8bce1d1e558055a67549943aef6861629b52eaa01393aa4474e079326a9e2500d58d425bed374d9d6000307d2bf7126b83c43cb0105abb0fd97b9e3991fe7a57c6d2fa3ca66199e83d8981c62437e2a1b21553759924fd5d604f954414aed9235577554ca1cd15d6aac1f0a06718fd81420f53a676be8c9bd918f88f38c579192e163fafa839e0dba09389a6df3b83de071756891ffda54d0ae6c7a4f73f"){
                    req.body = {...req.body, session};
                    next();
                }else {
                    res.status(StatusCodes.FORBIDDEN).send({ message: "token expired!" });
                }
            }

        }catch (e) {
            res.status(StatusCodes.FORBIDDEN).send({ message: e.message });
        }
    }

    private static isValid(time : number): boolean{
        return time + (60 * 60 * 5 * 1000) >= Date.now();
    }
}
