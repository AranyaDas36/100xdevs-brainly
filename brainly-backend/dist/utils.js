"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(num) {
    let val = "gnagsuhfbmlosht97654";
    let res = "";
    for (let i = 0; i < num; i++) {
        res += val[Math.floor((Math.random() * val.length))];
    }
    return res;
}
