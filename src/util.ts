import * as core from '@actions/core'
import { AxiosResponse } from 'axios'

export const validateStatusCode = (actualStatusCode: string): void => {
    const acceptedStatusCode: string[] = core.getInput('accept')
                                                .split(",").filter(x => x !== "")
                                                .map(x => x.trim());
    if(!acceptedStatusCode.includes(actualStatusCode)){
        throw new Error(`The accepted status code is ${acceptedStatusCode} but got ${actualStatusCode}`)
    }
}

export const buildOutput = (res: AxiosResponse <any>): string => {
    return JSON.stringify({
        "status_code": res.status,
        "data": res.data,
        "headers": res.headers
    })
}


