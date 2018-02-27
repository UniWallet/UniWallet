import * as types from '../constants/ActionTypes';
import {createAction} from 'redux-actions';
import * as transactionService from '../../services/transaction';
import * as storageService from '../../services/storage';
import * as Log from "../../libs/Log"
import {throwError, errors} from "../../libs/Error"

import * as etherutils from '../../libs/etherutils';
import {getTimestamp} from "../../libs/utils";
import * as Constant from "../../libs/constant"

var NativeAPI = require('react-native').NativeModules.YiYaNativeAPI;
const USING_ETH_UTILS = false;

function transactionActionCreator(actionType) {
    return createAction(actionType, (args)=> {
        return args;
    }, ()=> {
        return {
            unlock: 'transaction'
        }
    });
}

export const send = transactionActionCreator(types.SEND);

async function signTransaction(nonce, gasPrice, gasLimit, to, value, data, chainId, privateKey) {
    if (USING_ETH_UTILS) {
        return await etherutils.signTransaction({
                nonce: nonce,
                gasPrice: gasPrice,
                gas: gasLimit,
                to: to,
                value: value,
                data: data,
                chainId: chainId
            }, privateKey);
    } else {
        return await NativeAPI.signTransaction(nonce, gasPrice, gasLimit, to, value, data, chainId, privateKey);
    }
}

export const sendTransaction = createAction(types.SEND_TRANSACTION, async ({wallet, pwd, params, contractParams, nonceParams})=> {
    Log.log("send transaction");
    var privateKey;
    try {
        if (USING_ETH_UTILS) {
            const tmp = await etherutils.decryptKeyStore(wallet.keyStore, pwd);
            privateKey = tmp.privateKey;
        } else {
            const tmp = await NativeAPI.decryptV3Keystore(JSON.stringify(wallet.keystore), pwd)
            //Notice: lowCase key
            privateKey = tmp.privatekey;
        }
    } catch(error) {
        Log.log("decrypt v3 keystore: " + JSON.stringify(wallet.keystore) + " error: " + error)
        throwError(errors.wrong_password);
    }
    let txHash;
    try {
        let {nonce, gasPrice, gasLimit, to, value, data, chainId} = params;
        if (!nonce) {
            nonce = await etherutils.getNonce(wallet.address)
            Log.log("old nonce: " + nonce);
            if (nonceParams && nonceParams.pendingNum) {
                nonce += nonceParams.pendingNum;
                Log.log("update nonce to: " + nonce);
            }
        }
        if (!chainId) {
            chainId = await etherutils.getId()
        }
        if (!data) {
            data = "0x";
        }
        const txSigned = await signTransaction(nonce.toString(), gasPrice.toString(), gasLimit.toString(), to, value.toString(), data, chainId.toString(), privateKey);
        Log.log("tx signed: " + JSON.stringify(txSigned));
        txHash = await transactionService.processTx(txSigned.rawTransaction);
        Log.log("txHash: " + JSON.stringify(txHash));
        // transaction can't be confirmed immediately, so no need to get detail info here
    } catch(error) {
        throwError(errors.send_transaction);
    }
    /*
    const txInfo =     {
        "blockHash":"0x9d0cb4ca19a4085e5a9fb3a06ae19bd6bb5c310d6ea43ea171cdce1b9a05e373",
        "blockNumber":14299,
        "from":"0x6c6121573f1100f5aEAe75FEf8FFf770293f8Fd9",
        "gas":21000,
        "gasPrice":"180000000000",
        "hash":"0xcf72794cac78a69e5005be55e4cf8dc5796f1270b7215b0be2550398e3e1e186",
        "input":"0x",
        "nonce":8,
        "to":"0x06d659599Aa91a640FA706B089326FD3f2B0c92e",
        "transactionIndex":0,
        "value":"101",
        "v":"0x41",
        "r":"0x9ab419ae2a317b10e955efa20a5dc9a3d6bc2dac241b54b3b4476879c257fd3e",
        "s":"0x6cddd0554ad894e8e911b7fcfd6290726e5d8f4d9f95b0464200d8480c0ea85f"
    };
    */
    if (!txHash) {
        throwError(errors.send_transaction);
    }
    transaction = {
        hash:txHash,
        gas:params.gasLimit,
        from:wallet.address,
        to:params.to,
        value:params.value,
        gasPrice:params.gasPrice,
        input:params.data,
        nonce:params.nonce,
        confirmations:0,
        timestamp:getTimestamp(),
        status:null,
        type:contractParams?Constant.TRANSACTION_TYPE_CONTRACT:Constant.TRANSACTION_TYPE_DEFAULT,
        extra:{...contractParams},
    }
    Log.log("tx info: -> " + JSON.stringify(transaction));
    return {
        address: wallet.address,
        transaction,
    };
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        sync:"transaction",
        resolved,
        rejected
    }
});

export const registerName = transactionActionCreator(types.REGISTER_NAME);

export const getTxInfo = createAction(types.GET_TX_INFO, transactionService.getTxInfo);

export const getBlockInfo = createAction(types.GET_BLOCK_INFO, transactionService.getBlockInfo);

export const syncTxInfo = createAction(types.SYNC_TX_INFO, async ({address, hash}) => {
    let transaction = await transactionService.getTxInfo(hash)
    return {
        address: address,
        transaction: transaction
    }
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected,
        sync:"transaction",
    }
});

export const getTransactionList = createAction(types.GET_TRANSACTION_LIST, async ({address, count, offset, token}) => {
    return {
        address: address,
        transactions: await transactionService.getTransactionList(address, count, offset,token)
    };
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected,
        sync:"transaction",
    }
});

export const updateTransactionList = createAction(types.UPDATE_TRANSACTION_LIST, async ({address, count, token}) => {
    return {
        address: address,
        token: token,
        transactions: await transactionService.getTransactionList(address, count, 0, token)
    };
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected,
        sync:"transaction",
    }
});

export const getTransactionFromStorage = createAction(types.GET_TRANSACTION_FROM_STORAGE, ()=> {
    return storageService.getItem('transaction')
        .then(data=> {
            if (!data) {
                Log.log('no transaction data');
                data = {}
            }
            return data;
        });
});
