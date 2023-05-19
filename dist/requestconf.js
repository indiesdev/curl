"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.INPUT_RETRIES = exports.INPUT_CUSTOM_CONFIG_FILE = exports.INPUT_LOG_RESPONSE = exports.INPUT_ACCEPT = exports.INPUT_TIMEOUT = exports.INPUT_METHOD = exports.INPUT_BODY = exports.INPUT_PARAMS = exports.INPUT_HEADERS = exports.INPUT_URL = exports.INPUT_PROXY_AUTH_TOKEN = exports.INPUT_PROXY_URL = exports.INPUT_BEARER_TOKEN = exports.INPUT_BASIC_AUTH_TOKEN = void 0;
var util_1 = require("./util");
var core = __importStar(require("@actions/core"));
// builder for request config
// inputs
exports.INPUT_BASIC_AUTH_TOKEN = core.getInput("basic-auth-token");
exports.INPUT_BEARER_TOKEN = core.getInput("bearer-token");
exports.INPUT_PROXY_URL = core.getInput("proxy-url");
exports.INPUT_PROXY_AUTH_TOKEN = core.getInput("proxy-auth-token");
exports.INPUT_URL = core.getInput("url", {
    required: true,
});
exports.INPUT_HEADERS = core.getInput("headers");
exports.INPUT_PARAMS = core.getInput("params");
exports.INPUT_BODY = core.getInput("body");
exports.INPUT_METHOD = core.getInput("method");
exports.INPUT_TIMEOUT = core.getInput("timeout");
exports.INPUT_ACCEPT = core.getInput("accept");
exports.INPUT_LOG_RESPONSE = core.getBooleanInput("log-response");
exports.INPUT_CUSTOM_CONFIG_FILE = core.getInput("custom-config");
exports.INPUT_RETRIES = core.getInput("retries");
var builder = {
    basicAuth: function () {
        var basicAuthString = Buffer.from(exports.INPUT_BASIC_AUTH_TOKEN, "base64").toString();
        var basicAuthArr = basicAuthString.trim().split(":");
        if (basicAuthArr.length !== 2) {
            throw new Error("basic-auth-token format is invalid. The valid format should be username:password as base64.");
        }
        return {
            username: basicAuthArr[0],
            password: basicAuthArr[1],
        };
    },
    bearerToken: function () {
        return "Bearer " + exports.INPUT_BEARER_TOKEN;
    },
    proxy: function () {
        var proxy;
        if (exports.INPUT_PROXY_URL.includes("//")) {
            var proxyUrlArr = exports.INPUT_PROXY_URL.replace("//", "")
                .trim()
                .split(":");
            if (proxyUrlArr.length !== 3) {
                throw new Error("proxy-url format is invalid. The valid format should be host:port.");
            }
            proxy = {
                protocol: proxyUrlArr[0],
                host: proxyUrlArr[1],
                port: Number(proxyUrlArr[2]),
            };
        }
        else {
            var proxyUrlArr = exports.INPUT_PROXY_URL.trim().split(":");
            if (proxyUrlArr.length !== 2) {
                throw new Error("proxy-url format is invalid. The valid format should be host:port.");
            }
            proxy = {
                host: proxyUrlArr[0],
                port: Number(proxyUrlArr[1]),
            };
        }
        if (exports.INPUT_PROXY_AUTH_TOKEN) {
            var proxyAuthString = Buffer.from(exports.INPUT_PROXY_AUTH_TOKEN, "base64").toString();
            var proxyAuthArr = proxyAuthString.trim().split(":");
            if (proxyAuthArr.length !== 2) {
                throw new Error("proxy-auth format is invalid. The valid format should be username:password as base64.");
            }
            proxy.auth = {
                username: proxyAuthArr[0],
                password: proxyAuthArr[1],
            };
        }
        return proxy;
    },
};
// Request config
var config = {
    url: exports.INPUT_URL,
    method: exports.INPUT_METHOD,
    timeout: Number(exports.INPUT_TIMEOUT),
};
if (exports.INPUT_BASIC_AUTH_TOKEN) {
    config.auth = builder.basicAuth();
}
if (exports.INPUT_HEADERS) {
    config.headers = util_1.tryToParseJson(exports.INPUT_HEADERS);
}
if (exports.INPUT_PARAMS) {
    config.params = util_1.tryToParseJson(exports.INPUT_PARAMS);
}
if (exports.INPUT_BODY) {
    config.data = util_1.tryToParseJson(exports.INPUT_BODY);
}
if (exports.INPUT_BEARER_TOKEN) {
    config.headers = __assign(__assign({}, config.headers), { Authorization: builder.bearerToken() });
}
if (exports.INPUT_PROXY_URL) {
    config.proxy = builder.proxy();
}
if (exports.INPUT_ACCEPT) {
    var accepts_1 = util_1.getAcceptedStatusCodes();
    config.validateStatus = function (status) { return accepts_1.includes(status); };
}
exports.default = config;
//# sourceMappingURL=requestconf.js.map