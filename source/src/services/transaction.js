import {web3} from "../libs/web3"
import * as Log from "../libs/Log"
import * as utils from "../libs/utils"
import * as etherutils from "../libs/etherutils"
import config from '../configs';
import * as request from './request'
import {getWeb3url} from "../libs/web3";
import { rejects } from "assert";

export async function processTx(txSigned) {
    //web3.eth.sendSignedTransaction will call getTransactionReceipt loop every 1s, eat much cpu
    //Here, we call it by json rpc http request
    params = {
        "jsonrpc": "2.0",
        "method": "eth_sendRawTransaction",
        "params": [txSigned],
        "id": 1
    }
    let result = await request.postUrl(getWeb3url(), params)
    return result ? result.result:null;
    // return new Promise((resolved, rejected) => {
    //     web3.eth.sendSignedTransaction(txSigned)
    //     // .on('receipt', (result) => {
    //     //     Log.log("receipt:" + JSON.stringify(result))
    //     // })
    //     // .on('confirmation', (confirmNum, result) => {
    //     //     Log.log("confirmation:" + JSON.stringify(result))
    //     // })
    //     //If a out of gas error, the second parameter is the receipt.
    //         .on('error', (error, receipt) => {
    //             Log.log("error" + JSON.stringify(error))
    //             rejected(new Error(errors.send_transaction))
    //         })
    //         .on('transactionHash', (hash) => {
    //             Log.log("transactionHash:" + JSON.stringify(hash))
    //             try {
    //                 resolved(hash);
    //             } catch (e) {
    //                 Log.log("resolve send transaction error," + e)
    //                 rejected(new Error(errors.send_transaction))
    //             }
    //         });
    // });
}

/*
{
  "blockHash":"0x9d0cb4ca19a4085e5a9fb3a06ae19bd6bb5c310d6ea43ea171cdce1b9a05e373",
  "blockNumber":14299,
  "from":"0x6c6121573f1100f5aEAe75FEf8FFf770293f8Fd9",
  "gas":21000,
  "gasPrice":"180000000000",
  "hash":"0xcf72794cac78a69e5005be55e4cf8dc5796f1270b7215b0be2550398e3e1e186",
  "input":"0x",
  "nonce":1,
  "to":"0x06d659599Aa91a640FA706B089326FD3f2B0c92e",
  "transactionIndex":0,
  "value":"100",
  "v":"0x41",
  "r":"0x9ab419ae2a317b10e955efa20a5dc9a3d6bc2dac241b54b3b4476879c257fd3e",
  "s":"0x6cddd0554ad894e8e911b7fcfd6290726e5d8f4d9f95b0464200d8480c0ea85f"
}
*/
export async function getTxInfo(txHash) {
    params = {
        hash:txHash,
    }
    let data = await request.get("transaction", params);
    if (data && data.hash) {
        if (data.extra) {
            data.extra = JSON.parse(data.extra)
        }
        return data;
    } else {
        return null;
    }
}

export function getBlockInfo(block) {
    return web3.eth.getBlock(block);
}

export function getBalanceByAddress(address) {
    return web3.eth.getBalance(address)
}

export async function getTransactionList(address, count= 40, offset=0,token = null) {
    params = {
        address,
        count,
        offset,
        asc:0,
    }
    if(token){
        params = {...params,token}
    }
    let data = await request.get("txlist", params);
    return data;
}

/* token related */
export async function getTokenBalanceByAddress(token_name, token_address, address) {
    Log.log("get token balance - token name: " + token_name + " token_address: " + token_address + " address: " + address);
    var contact = new web3.eth.Contract(etherutils.ERC20_abi, token_address, {from: address});
    var balance = 0;
    balance = await contact.methods.balanceOf(address).call();
    if (typeof balance == "string") {
        balance = parseInt(balance, 10);
    }
    /*
        parse the token's decimal
    */
    let token_info = utils.getTokenUnitFromAddress(token_address);
    Log.log("token info: " + JSON.stringify(token_info));
    if (token_info) {
        let decimal_value = parseInt(token_info.decimal, 10)
        balance = balance/Math.pow(10, decimal_value);
    }
    return balance;
}