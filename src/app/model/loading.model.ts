export class LoadingFlag {
    start: boolean;
    end: boolean;
    pending: boolean;
    result: boolean;
    count: number;

    constructor(){
        this.start = null;
        this.end = null;
        this.pending = null;
        this.result = null;
        this.count = 0;
    }

    public setStart(val:boolean) {
        this.start = val;
        if(val===true){
            this.pending = true;
            this.end = false;
        }
        this.result = null;
        this.count ++;
    }

    public setPending(val:boolean) {
        this.pending = val;
        if(val === false){
            this.start = false;
        }else{
            this.end = true;
        }
    }

    public setResult(val:boolean) {
        this.result = val;
        this.pending = false;
        this.start = false;
        this.end = true;
    }
}