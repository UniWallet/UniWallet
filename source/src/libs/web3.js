import { default as Web3 } from 'web3';
import config from '../configs';
import * as Log from "./Log";

var curWeb3Url = null;
export const web3 = new Web3();

export function getWeb3url() {
    return curWeb3Url;
}

export const updateProviderUrl = (url) => {
    try {
        Log.log("update web3 provider url " + url)
        curWeb3Url = url
        web3.setProvider(new Web3.providers.HttpProvider(url));
    } catch (error) {
        Log.log("update web3 provider url fail," + error)
    }
}
updateProviderUrl(config.web3Url)