import * as core from '@actions/core'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import setOutput from './output'

export const validateStatusCode = (actualStatusCode: string): void => {
    const acceptedStatusCode: string[] = core.getInput('accept')
        .split(",").filter(x => x !== "")
        .map(x => x.trim());
    if (!acceptedStatusCode.includes(actualStatusCode)) {
        throw new Error(`The accepted status code is ${acceptedStatusCode} but got ${actualStatusCode}`)
    }
}

export const buildOutput = (res: AxiosResponse<any>): string => {
    return JSON.stringify({
        "status_code": res.status,
        "data": res.data,
        "headers": res.headers
    })
}

export const sendRequestWithRetry = async (config: AxiosRequestConfig) => {
    var exit = false
    var countRetry = 0
    const retryArr: string[] = core.getInput('retry').split('/')
    const numberOfRetry: number = Number(retryArr[0])
    const backoff: number = Number(retryArr[1])
    do {
        try {
            const res = await axios(config)
            setOutput(res)
            exit = true
        } catch (err) {
            countRetry += 1
            if (countRetry <= numberOfRetry) {
                core.info(`retry: ${countRetry}`)
                await sleep(backoff * 1000)
            } else {
                exit = true
                core.setFailed(err)
            }
        }
    } while (!exit)
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

