export class Utils{

    private static getTimeParameters(){
        const date = new Date();
        const timeZoneDiff = date.getTimezoneOffset() + 180;
        const hour = (date.getHours() + (timeZoneDiff / 60)) % 24;
        const untilNow = (hour * 60 + date.getMinutes()) * 60000;

        return { day: 24 * 60 * 60 * 1000, untilNow, now: Date.now() };
    }
    public static isStrikeTime(time: number): number{
        const { day, untilNow, now } = Utils.getTimeParameters();
        if(time + untilNow > now){
            return 0;
        }else if(time + untilNow + day > now){
            return 1;
        }else{
            return -1;
        }
    }

    public static isExpiredContentTime(time: number): boolean{
        const { day, untilNow, now } = Utils.getTimeParameters();
        const total = time + (2 * day) - untilNow;
        return total > now;
    }
}
