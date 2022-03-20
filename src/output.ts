import { INPUT_LOG_RESPONSE } from "./requestconf";
import * as core from "@actions/core";
import * as util from "./util";
import { AxiosResponse } from "axios";

const setOutput = (res: void | AxiosResponse<any>) => {
  if (!res) {
    throw new Error("No response from request");
  }
  if (INPUT_LOG_RESPONSE) {
    core.info(`Response: ${util.buildOutput(res)}`);
  }
  core.setOutput("response", util.buildOutput(res));
};

export default setOutput;
