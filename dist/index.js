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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var requestconf_1 = __importStar(require("./requestconf"));
var core = __importStar(require("@actions/core"));
var fs = __importStar(require("fs"));
var util_1 = require("./util");
try {
    if (requestconf_1.INPUT_CUSTOM_CONFIG_FILE) {
        core.info("Using custom axios config file");
        var basePath = process.env.GITHUB_WORKSPACE;
        var path = basePath + "/" + requestconf_1.INPUT_CUSTOM_CONFIG_FILE;
        core.debug("Path is " + path);
        if (requestconf_1.INPUT_CUSTOM_CONFIG_FILE.split(".").pop() !== "json") {
            throw new Error("Config must be json file");
        }
        if (!fs.existsSync(path)) {
            throw new Error("Config file not found, meybe you need to use action/checkout before this step or there is typo on file name");
        }
        var customConfig = JSON.parse(fs.readFileSync(path).toString());
        util_1.sendRequestWithRetry(customConfig);
    }
    else {
        core.info("Using config from action params");
        util_1.sendRequestWithRetry(requestconf_1.default);
    }
}
catch (err) {
    core.setFailed(err.message);
}
//# sourceMappingURL=index.js.map