"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Propine = void 0;
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
class Propine {
    constructor(fileName) {
        this._fileName = fileName;
        this._rs = fs.createReadStream(this._fileName);
        this._rl = readline.createInterface(this._rs);
    }
    getLatestValue() {
        let count = 0;
        let trans;
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
                }
                else {
                    let fields = line.split(",");
                    let curr = {
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
    getLatestValueByToken(token) {
        let count = 0;
        let trans;
        this._rl.on("line", (line) => {
            if (count > 0) {
                let fields = line.split(",");
                let curr = {
                    timestamp: parseInt(fields[0]),
                    transaction_type: fields[1],
                    toke: fields[2],
                    amount: parseFloat(fields[3])
                };
                if (curr.toke.toLowerCase() === token.toLocaleLowerCase()) {
                    if (trans === undefined) {
                        trans = curr;
                    }
                    else {
                        trans = trans.timestamp > curr.timestamp ? trans : curr;
                    }
                }
            }
            count++;
        }).on("close", () => {
            console.log(`The latest portfolio value by + ${token.toLocaleUpperCase()} ${trans.amount}`);
        });
    }
    getLatestValueByDate(year, month, day) {
        let count = 0;
        let inputDate = new Date(year, month - 1, day);
        this._rl.on("line", (line) => {
            if (count > 0) {
                let fields = line.split(",");
                let curr = {
                    timestamp: parseInt(fields[0]),
                    transaction_type: fields[1],
                    toke: fields[2],
                    amount: parseFloat(fields[3])
                };
                let date = new Date(curr.timestamp);
                date.setHours(0, 0, 0, 0);
                if (inputDate.toISOString() == date.toISOString()) {
                    console.log(`${inputDate.getFullYear()}-${inputDate.getMonth() + 1}-${inputDate.getDate()} ${curr.toke} ${curr.amount}`);
                }
            }
            count++;
        });
    }
    getLatestValueByDateToken(year, month, day, token) {
        let count = 0;
        let inputDate = new Date(year, month - 1, day);
        this._rl.on("line", (line) => {
            if (count > 0) {
                let fields = line.split(",");
                let curr = {
                    timestamp: parseInt(fields[0]),
                    transaction_type: fields[1],
                    toke: fields[2],
                    amount: parseFloat(fields[3])
                };
                let date = new Date(curr.timestamp);
                date.setHours(0, 0, 0, 0);
                if (inputDate.toISOString() == date.toISOString() && curr.toke.toLowerCase() == token.toLowerCase()) {
                    console.log(`${inputDate.getFullYear()}-${inputDate.getMonth() + 1}-${inputDate.getDate()} ${curr.toke} ${curr.amount}`);
                }
            }
            count++;
        });
    }
}
exports.Propine = Propine;
var propine = new Propine("transactions.csv");
propine.getLatestValue();
//propine.getLatestValueByToken("ETH");
//propine.getLatestValueByDate(1970, 1, 19);
//propine.getLatestValueByDateToken(1970, 1, 19, "ETH");
