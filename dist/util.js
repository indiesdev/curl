"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
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
//# sourceMappingURL=util.js.map