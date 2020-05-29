"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var axios_1 = __importDefault(require("axios"));
var output_1 = __importDefault(require("./output"));
exports.validateStatusCode = function (actualStatusCode) {
    var acceptedStatusCode = core.getInput('accept')
        .split(",").filter(function (x) { return x !== ""; })
        .map(function (x) { return x.trim(); });
    if (!acceptedStatusCode.includes(actualStatusCode)) {
        throw new Error("The accepted status code is " + acceptedStatusCode + " but got " + actualStatusCode);
    }
};
exports.buildOutput = function (res) {
    return JSON.stringify({
        "status_code": res.status,
        "data": res.data,
        "headers": res.headers
    });
};
exports.sendRequestWithRetry = function (config) {
    var exit = false;
    var countRetry = 0;
    var retryArr = core.getInput('retry').split('/');
    var numberOfRetry = Number(retryArr[0]);
    var backoff = Number(retryArr[1]);
    do {
        axios_1.default(config)
            .then(function (res) {
            exit = true;
            output_1.default(res);
        })
            .catch(function (err) {
            countRetry += 1;
            core.info("retry: " + countRetry);
            if (countRetry <= numberOfRetry) {
                //await sleep(backoff * 1000)
            }
            else {
                exit = true;
                core.setFailed(err);
            }
        });
    } while (!exit);
};
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
//# sourceMappingURL=util.js.map