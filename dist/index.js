"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var requestconf_1 = __importDefault(require("./requestconf"));
var core = __importStar(require("@actions/core"));
var output_1 = __importDefault(require("./output"));
var fs = __importStar(require("fs"));
try {
    if (core.getInput('custom-config')) {
        var configPath = core.getInput('custom-config');
        var basePath = process.env.GITHUB_WORKSPACE;
        var path = basePath + "/" + configPath;
        core.info("Path is " + path);
        if (configPath.split('.').pop() !== 'json') {
            throw new Error('Config must be json file');
        }
        if (!fs.existsSync(path)) {
            throw new Error('Config file not found, meybe you need to use action/checkout before this step or there is typo on file name');
        }
        var customConfig = JSON.parse(fs.readFileSync(path).toString());
        axios_1.default(customConfig).then(function (res) { return output_1.default(res); }).catch(function (err) { return core.setFailed(err.message); });
    }
    else {
        axios_1.default(requestconf_1.default).then(function (res) { return output_1.default(res); }).catch(function (err) { return core.setFailed(err.message); });
    }
}
catch (err) {
    core.setFailed(err.message);
}
//# sourceMappingURL=index.js.map