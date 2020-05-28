import * as core from '@actions/core'
import * as util from './util'
import { AxiosResponse } from 'axios'

const setOutput = (res: void | AxiosResponse <any>) => {
    if(!res){
        throw new Error('No response from request')
    }
    util.validateStatusCode(res.status.toString());
    if(core.getInput('is_debug') === 'true'){
        core.info(util.buildOutput(res));
    }
    core.setOutput('response', util.buildOutput(res));
}


export default setOutput