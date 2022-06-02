export interface Company {
    id: number;
    code: string;
    name: string;
    fullname: string;
    public: number;
    phone: string;
    email: string;
    address: string;
    website: string;
}

export interface Farm {
    id: number;
    code: string;
    name: string;
    public: number;
    address: string;
}

export interface Pond {
    id: number;
    code: string;
    name: string;
    public: number;
    area: number;
    create_cost: number;
    deep: number;
    expire_date: number;
}


export interface CalendarInterface {
    add_time: number;
    company_id: string;
    content: string;
    disable: number;
    done: number;
    edit_time: number;
    farm_id: string;
    farm_name: string;
    id: number;
    inspect: number;
    pond_id: string;
    pond_name: string;
    time: number;
    user_id: number;
    user_perform: number;
}

export interface PondInterface {
    id: number;
    farm_id: number;
    farm_name: string;
    code: string;
    name: string;
}

export class inputPipe {
    public type: string;
    public fakeView: string;
    public input: string;
    public realValue: number;

    constructor(
        input: string,
        type: string = 'currency'
    ) {
        this.setType(type);
        this.setInput(input);
        this.processConvert();
    }

    public setInput(input: string) {
        if (typeof input !== 'string') input = String(input);
        this.input = input;
    }

    public setValue(val) {
        if (typeof val !== 'string') val = String(val);
        this.input = val;
        this.processConvert();
    }

    public setType(type: string) {
        this.type = type;
    }

    public processConvert() {
        let stringFilted = this.input.split(',').join('');
        let afterPoint: string;
        // Cat bo string sau dau cham thu 2
        if (stringFilted.indexOf('.') != stringFilted.lastIndexOf('.')) {
            stringFilted = stringFilted.slice(0, stringFilted.lastIndexOf('.'));
        }

        let stringLengt: number;

        //Xu ly lay phan nguyen
        if (stringFilted.indexOf('.') != -1) {
            stringLengt = stringFilted.indexOf('.');
            let temp = stringFilted.split('.');
            stringFilted = temp[0];
            if (this.type === 'float') {
                afterPoint = temp[1].substring(0, 2);
            }
        } else {
            stringLengt = stringFilted.length;
        }

        //console.log(stringFilted);

        let integer = new Array();
        let _y = 1;
        for (var _i = -3; Math.abs(_i) < stringLengt; (_i = _i - 3)) {
            //console.log(_y);
            integer.push(stringFilted.slice(_i, stringLengt + _i + 3));
            _y++;
        }

        //Lay phan thua phia dua so
        let phanDau = stringFilted.slice(0, stringLengt - ((_y - 1) * 3));
        if (phanDau.length > 0) {
            integer.push(phanDau);
        }
        integer.reverse();

        let tem_int_real: string = stringFilted.replace(/,/gi, '');
        let tem_point_real: string = '';

        this.fakeView = integer.join();
        // Xu ly sau dau cham
        if (this.type === 'float' && afterPoint != null) {
            this.fakeView = this.fakeView + '.' + afterPoint;
            tem_point_real = afterPoint;
        }

        this.realValue = parseFloat(tem_int_real + '.' + tem_point_real);
    }

}
