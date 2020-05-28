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
var util = __importStar(require("./util"));
var setOutput = function (res) {
    if (!res) {
        throw new Error('No response from request');
    }
    util.validateStatusCode(res.status.toString());
    if (core.getInput('is_debug') === 'true') {
        core.info(util.buildOutput(res));
    }
    core.setOutput('response', util.buildOutput(res));
};
exports.default = setOutput;
//# sourceMappingURL=output.js.map