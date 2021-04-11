import {AppRouter} from "./AppRouter";
import { Router, Response, Request } from "express";
import {StatusCodes} from "http-status-codes";
import {ContactService} from "../db/Service/ContactService";
import {Auth} from "./Auth";


export class ContactRouter extends AppRouter{
    router: Router;

    private service: ContactService;


    constructor(service: ContactService) {
        super();
        this.router = Router();
        this.service = service;

        this.addRoutes();
    }

    addRoutes(): void {
        this.router.post("/",  this.getContact.bind(this));
    }

    private async getContact(req: Request, res: Response){
        try {
            let { name, mail, message } = req.body;
            if(message == null) return res.status(StatusCodes.BAD_REQUEST).send({message: "message needed!"});
            this.service.createContact(name, mail,message);


              var nodemailer = require('nodemailer');
              var transporter = nodemailer.createTransport({
                //service: 'gmail',
                host: 'mail.sahajayogameditasyon.com',
                port:465,
                secure:true,
                auth: {
                  user: 'devicesendmail@gmail.com',
                  pass: 'udqailgpjaqdrmsb'
                }
              });

              var mailOptions = {
                from: 'Sahaja Yoga <info@sahajayogameditasyon.com>',
                to: 'sahaja.yoga.meditasyon@gmail.com',
                cc: 'info@sahajayogameditasyon.com',
                subject: 'Sahaja Yoga İletişim Uygulama',
                html: 'İsim : ' + name + '<br />Email : ' + mail + '<br />Mesaj : ' + message
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

            res.status(StatusCodes.OK).send({ message: "Talebinizi kaydettik teşekkür ederiz." });
        }catch (e){

        }
    }



}
