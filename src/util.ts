import { INPUT_ACCEPT, INPUT_RETRIES } from "./requestconf";
import * as core from "@actions/core";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import setOutput from "./output";
import * as rax from "retry-axios";
import * as yaml from "js-yaml";

export const getAcceptedStatusCodes = (): number[] => {
  const acceptedStatusCodes: string[] = (INPUT_ACCEPT as string)
    .split(",")
    .filter((x) => x !== "")
    .map((x) => x.trim());
  let output: number[] = [];
  for (let acceptedStatusCode of acceptedStatusCodes) {
    if (isNaN(Number(acceptedStatusCode))) {
      throw new Error(`Accept status ${acceptedStatusCode} is invalid`);
    }
    output.push(Number(acceptedStatusCode));
  }
  return output;
};

export const buildOutput = (res: AxiosResponse<any>): string => {
  return JSON.stringify({
    status_code: res.status,
    data: res.data,
    headers: res.headers,
  });
};

export const tryToParseJson = (data: string): string | unknown => {
  let output: string | unknown = data;

  // try to parse json directly
  try {
    output = JSON.parse(data);
    return output;
  } catch {
    // do nothing
  }

  // try to parse json from yaml
  try {
    output = yaml.load(data, { json: true });
    return output;
  } catch {
    // do nothing
  }
  return data;
};

export const sendRequestWithRetry = async (config: AxiosRequestConfig) => {
  const client = axios.create();
  if (INPUT_RETRIES) {
    if (isNaN(Number(INPUT_RETRIES))) {
      throw new Error("retries should be number");
    }
    client.defaults.raxConfig = {
      instance: client,
      retry: Number(INPUT_RETRIES),
      httpMethodsToRetry: [config.method ?? ''],
      onRetryAttempt: (err) => {
        const cfg = rax.getConfig(err);
        core.info(`Retry attempt #${cfg?.currentRetryAttempt}`);
      },
    };
    rax.attach(client);
  }
  client
    .request(config)
    .then((resp) => setOutput(resp))
    .catch((err) => core.setFailed(err));
};
