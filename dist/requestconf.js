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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
// builder for request config
var builder = {
    basicAuth: function () {
        var authArr = core.getInput('basic-auth').trim().split(':');
        if (authArr.length !== 2) {
            throw new Error('basic-auth format is invalid. The valid format should be username:password.');
        }
        return {
            username: authArr[0],
            password: authArr[1]
        };
    },
    bearerToken: function () {
        return "Bearer " + core.getInput('bearer-token');
    },
    proxy: function () {
        var proxy;
        if (core.getInput('proxy-url').includes('//')) {
            var proxyUrlArr = core.getInput('proxy-url').replace('//', '').trim().split(':');
            if (proxyUrlArr.length !== 3) {
                throw new Error('proxy-url format is invalid. The valid format should be host:port.');
            }
            proxy = {
                protocol: proxyUrlArr[0],
                host: proxyUrlArr[1],
                port: Number(proxyUrlArr[2])
            };
        }
        else {
            var proxyUrlArr = core.getInput('proxy-url').trim().split(':');
            if (proxyUrlArr.length !== 2) {
                throw new Error('proxy-url format is invalid. The valid format should be host:port.');
            }
            proxy = {
                host: proxyUrlArr[0],
                port: Number(proxyUrlArr[1])
            };
        }
        if (core.getInput('proxy-auth')) {
            var proxyAuthArr = core.getInput('proxy-auth').trim().split(':');
            if (proxyAuthArr.length !== 2) {
                throw new Error('proxy-auth format is invalid. The valid format should be username:password.');
            }
            proxy.auth = {
                username: proxyAuthArr[0],
                password: proxyAuthArr[1]
            };
        }
        return proxy;
    }
};
// Request config  
var config = {
    url: core.getInput('url'),
    method: core.getInput('method'),
    timeout: Number(core.getInput('timeout'))
};
if (core.getInput('basic-auth')) {
    config.auth = builder.basicAuth();
}
if (core.getInput('headers')) {
    config.headers = JSON.parse(core.getInput('headers'));
}
if (core.getInput('params')) {
    config.params = JSON.parse(core.getInput('params'));
}
if (core.getInput('body')) {
    config.data = core.getInput('body');
}
if (core.getInput('bearer-token')) {
    config.headers = __assign(__assign({}, config.headers), { Authorization: builder.bearerToken() });
}
if (core.getInput('proxy-url')) {
    config.proxy = builder.proxy();
}
exports.default = config;
//# sourceMappingURL=requestconf.js.map