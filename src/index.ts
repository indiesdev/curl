import { AxiosRequestConfig } from "axios";
import config, { INPUT_CUSTOM_CONFIG_FILE } from "./requestconf";
import * as core from "@actions/core";
import * as fs from "fs";
import { sendRequestWithRetry } from "./util";

try {
  if (INPUT_CUSTOM_CONFIG_FILE) {
    core.info(`Using custom axios config file`);
    const basePath = process.env.GITHUB_WORKSPACE;
    const path = `${basePath}/${INPUT_CUSTOM_CONFIG_FILE}`;
    core.debug(`Path is ${path}`);
    if ((INPUT_CUSTOM_CONFIG_FILE as string).split(".").pop() !== "json") {
      throw new Error("Config must be json file");
    }
    if (!fs.existsSync(path)) {
      throw new Error(
        "Config file not found, meybe you need to use action/checkout before this step or there is typo on file name"
      );
    }
    const customConfig: AxiosRequestConfig = JSON.parse(
      fs.readFileSync(path).toString()
    ) as AxiosRequestConfig;
    sendRequestWithRetry(customConfig);
  } else {
    core.info(`Using config from action params`);
    sendRequestWithRetry(config);
  }
} catch (err) {
  core.setFailed((err as Error).message);
}
