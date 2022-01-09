import * as fs from "fs"
import * as readline from "readline"

export interface Transaction {
    timestamp: number,
    transaction_type: string,
    toke: string,
    amount: number
}

export class Propine {
    private _fileName:string;
    private _rs: fs.ReadStream;
    private _rl: readline.Interface;

    constructor (fileName: string) {
        this._fileName = fileName;
        this._rs = fs.createReadStream(this._fileName);
        this._rl = readline.createInterface(this._rs);
    }

    getLatestValue() {
        let count = 0;
        let trans: Transaction;
    
        this._rl.on("line", (line) => {
            if (count > 0) {
                if (count == 1) {
                    let fields = line.split(",");
                    trans = {
                        timestamp: parseInt(fields[0]),
                        transaction_type: fields[1],
                        toke: fields[2],
                        amount: parseFloat(fields[3])
                    };
                } else {
                    let fields = line.split(",");
                    let curr: Transaction = {
                        timestamp: parseInt(fields[0]),
                        transaction_type: fields[1],
                        toke: fields[2],
                        amount: parseFloat(fields[3])
                    };
                    trans = trans.timestamp > curr.timestamp ? trans : curr;
                }
            }
            count++;
        }).on("close", () => {
            console.log(`The latest portfolio value: ${trans.amount}`);
        });
    }

    getLatestValueByToken(token: string) {
        let count = 0;
        let trans: Transaction;
    
        this._rl.on("line", (line) => {
            if (count > 0) {
                let fields = line.split(",");
                let curr: Transaction = {
                    timestamp: parseInt(fields[0]),
                    transaction_type: fields[1],
                    toke: fields[2],
                    amount: parseFloat(fields[3])
                };
    
                if (curr.toke.toLowerCase() === token.toLocaleLowerCase()) {
                    if (trans === undefined) {
                        trans = curr;
                    } else {
                        trans = trans.timestamp > curr.timestamp ? trans : curr;
                    }
    
                }
            }
            count++;
        }).on("close", () => {
            console.log(`The latest portfolio value by + ${token.toLocaleUpperCase()} ${trans.amount}`);
        });
    }
    
    getLatestValueByDate(year: number, month: number, day: number) {
        let count = 0;
        let inputDate: Date = new Date(year, month - 1, day);
    
        this._rl.on("line", (line) => {
            if (count > 0) {
                let fields = line.split(",");
                let curr: Transaction = {
                    timestamp: parseInt(fields[0]),
                    transaction_type: fields[1],
                    toke: fields[2],
                    amount: parseFloat(fields[3])
                };
                let date = new Date(curr.timestamp);
                date.setHours(0, 0, 0, 0);
                if (inputDate.toISOString() == date.toISOString()) {
                    console.log(`${inputDate.getFullYear()}-${inputDate.getMonth() + 1}-${inputDate.getDate()} ${curr.toke} ${curr.amount}`)
                }
            }
            count++;
        });
    }
    
    getLatestValueByDateToken(year: number, month: number, day: number, token: string) {
        let count = 0;
        let inputDate: Date = new Date(year, month - 1, day);
    
        this._rl.on("line", (line) => {
            if (count > 0) {
                let fields = line.split(",");
                let curr: Transaction = {
                    timestamp: parseInt(fields[0]),
                    transaction_type: fields[1],
                    toke: fields[2],
                    amount: parseFloat(fields[3])
                };
                let date = new Date(curr.timestamp);
                date.setHours(0, 0, 0, 0);
                if (inputDate.toISOString() == date.toISOString() && curr.toke.toLowerCase() == token.toLowerCase()) {
                    console.log(`${inputDate.getFullYear()}-${inputDate.getMonth() + 1}-${inputDate.getDate()} ${curr.toke} ${curr.amount}`)
                }
            }
            count++;
        });
    }
}

var propine = new Propine("transactions.csv");
propine.getLatestValue();
//propine.getLatestValueByToken("ETH");
//propine.getLatestValueByDate(1970, 1, 19);
//propine.getLatestValueByDateToken(1970, 1, 19, "ETH");