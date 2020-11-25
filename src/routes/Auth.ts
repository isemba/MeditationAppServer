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

    public static getDecrypt(data:string){
        return this.cryptr.decrypt(data);
    }

    public static async checkToken(req, res, next) {
        // const auth = req.headers.authorization;
        // if(!auth) return res.status(StatusCodes.UNAUTHORIZED).send({ message: "please log in" });
        //
        // const token = req.headers.authorization.split(" ")[1];
        // try {
        //     const user = jwt.verify(token, Auth.jwtSecret);
        //     req.body = {...req.body, user};
        //     next();
        // }catch (e) {
        //     res.status(StatusCodes.FORBIDDEN).send({ message: e.message });
        // }
    }
}
