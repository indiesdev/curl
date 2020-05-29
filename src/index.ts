
import axios, { AxiosRequestConfig } from 'axios'
import config from './requestconf'
import * as core from '@actions/core'
import * as fs from 'fs'
import { sendRequestWithRetry } from './util'

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

process.on('uncaughtException', function (err) {
    core.debug("Hahahaha")
    core.setFailed("eiei")
  });

try {
    if(core.getInput('custom-config')){
        const configPath = core.getInput('custom-config');
        const basePath = process.env.GITHUB_WORKSPACE;
        const path = `${basePath}/${configPath}`;
        core.info(`Path is ${path}`);
        if(configPath.split('.').pop() !== 'json'){
            throw new Error('Config must be json file')
        }
        if(!fs.existsSync(path)){
            throw new Error('Config file not found, meybe you need to use action/checkout before this step or there is typo on file name')
        }
        let customConfig:  AxiosRequestConfig = JSON.parse(fs.readFileSync(path).toString()) as AxiosRequestConfig;
        sendRequestWithRetry(customConfig)
    }else{
        sendRequestWithRetry(config)
    }
} catch (err) {
    core.setFailed(err.message);
}

