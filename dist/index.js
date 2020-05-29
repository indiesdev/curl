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
var requestconf_1 = __importDefault(require("./requestconf"));
var core = __importStar(require("@actions/core"));
var fs = __importStar(require("fs"));
var util_1 = require("./util");
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
process.on('uncaughtException', function (err) {
    core.debug("Hahahaha");
    core.setFailed("eiei");
});
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
        util_1.sendRequestWithRetry(customConfig);
    }
    else {
        util_1.sendRequestWithRetry(requestconf_1.default);
    }
}
catch (err) {
    core.setFailed(err.message);
}
//# sourceMappingURL=index.js.map