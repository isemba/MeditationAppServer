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
                if(Auth.isValid(session.at)){
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
