import { getAcceptedStatusCodes, tryToParseJson } from "./util";
import * as core from "@actions/core";
import {
  AxiosRequestConfig,
  Method,
  AxiosBasicCredentials,
  AxiosProxyConfig,
  AxiosRequestHeaders,
} from "axios";
import * as yaml from "js-yaml";

// builder for request config

// inputs
export const INPUT_BASIC_AUTH_TOKEN: Readonly<string> =
  core.getInput("basic-auth-token");
export const INPUT_BEARER_TOKEN: Readonly<string> =
  core.getInput("bearer-token");
export const INPUT_PROXY_URL: Readonly<string> = core.getInput("proxy-url");
export const INPUT_PROXY_AUTH_TOKEN: Readonly<string> =
  core.getInput("proxy-auth-token");
export const INPUT_URL: Readonly<string> = core.getInput("url", {
  required: true,
});
export const INPUT_HEADERS: Readonly<string> = core.getInput("headers");
export const INPUT_PARAMS: Readonly<string> = core.getInput("params");
export const INPUT_BODY: Readonly<string> = core.getInput("body");
export const INPUT_METHOD: Readonly<Method> = core.getInput("method") as Method;
export const INPUT_TIMEOUT: Readonly<string> = core.getInput("timeout");
export const INPUT_ACCEPT: Readonly<string> = core.getInput("accept");
export const INPUT_LOG_RESPONSE: Readonly<boolean> =
  core.getBooleanInput("log-response");
export const INPUT_CUSTOM_CONFIG_FILE: Readonly<string> =
  core.getInput("custom-config");
export const INPUT_RETRIES: Readonly<string> = core.getInput("retries");

const builder = {
  basicAuth: (): AxiosBasicCredentials => {
    const basicAuthString: string = Buffer.from(
      INPUT_BASIC_AUTH_TOKEN,
      "base64"
    ).toString();
    const basicAuthArr: string[] = basicAuthString.trim().split(":");
    if (basicAuthArr.length !== 2) {
      throw new Error(
        "basic-auth-token format is invalid. The valid format should be username:password as base64."
      );
    }
    return {
      username: basicAuthArr[0],
      password: basicAuthArr[1],
    };
  },
  bearerToken: (): string => {
    return `Bearer ${INPUT_BEARER_TOKEN}`;
  },
  proxy: (): AxiosProxyConfig => {
    let proxy: AxiosProxyConfig;
    if (INPUT_PROXY_URL.includes("//")) {
      const proxyUrlArr: string[] = INPUT_PROXY_URL.replace("//", "")
        .trim()
        .split(":");
      if (proxyUrlArr.length !== 3) {
        throw new Error(
          "proxy-url format is invalid. The valid format should be host:port."
        );
      }
      proxy = {
        protocol: proxyUrlArr[0],
        host: proxyUrlArr[1],
        port: Number(proxyUrlArr[2]),
      };
    } else {
      const proxyUrlArr: string[] = INPUT_PROXY_URL.trim().split(":");
      if (proxyUrlArr.length !== 2) {
        throw new Error(
          "proxy-url format is invalid. The valid format should be host:port."
        );
      }
      proxy = {
        host: proxyUrlArr[0],
        port: Number(proxyUrlArr[1]),
      };
    }
    if (INPUT_PROXY_AUTH_TOKEN) {
      const proxyAuthString: string = Buffer.from(
        INPUT_PROXY_AUTH_TOKEN,
        "base64"
      ).toString();
      const proxyAuthArr: string[] = proxyAuthString.trim().split(":");
      if (proxyAuthArr.length !== 2) {
        throw new Error(
          "proxy-auth format is invalid. The valid format should be username:password as base64."
        );
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

const config: AxiosRequestConfig = {
  url: INPUT_URL,
  method: INPUT_METHOD,
  timeout: Number(INPUT_TIMEOUT),
};

if (INPUT_BASIC_AUTH_TOKEN) {
  config.auth = builder.basicAuth();
}

if (INPUT_HEADERS) {
  config.headers = tryToParseJson(INPUT_HEADERS) as AxiosRequestHeaders;
}

if (INPUT_PARAMS) {
  config.params = tryToParseJson(INPUT_PARAMS);
}

if (INPUT_BODY) {
  config.data = tryToParseJson(INPUT_BODY);
}

if (INPUT_BEARER_TOKEN) {
  config.headers = { ...config.headers, Authorization: builder.bearerToken() };
}

if (INPUT_PROXY_URL) {
  config.proxy = builder.proxy();
}

if (INPUT_ACCEPT) {
  const accepts = getAcceptedStatusCodes();
  config.validateStatus = (status) => accepts.includes(status);
}

export default config;
