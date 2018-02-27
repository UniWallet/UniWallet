import * as types from '../constants/ActionTypes';
import * as Log from "../../libs/Log"
import * as etherutils from "../../libs/etherutils"
import {isConfirmedTransaction} from "../../libs/utils";
import * as Constant from "../../libs/constant"
import Global from "../../components/common/Global"
/*
web3.eth.getTransaction():
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

yiya.io
    {
        "hash":"0xe771434b138e35c51218ecd3150e2e9e95fe797f1957c78667b8127a01613d1f",
        "blockNumber":"5774",
        "from":"0x4DACd41b0Fd2c7AD3F02C74236871a3854016979",
        "to":"0x6c6121573f1100f5aEAe75FEf8FFf770293f8Fd9",
        "gas":"90000",
        "gasPrice":"18000000000",
        "value":"9223372036854775807",
        "nonce":"5",
        "timestamp":"1508378568"
     }

Yiya API is used only for import wallets.

Structure:
0) transaction:
   {
        "token", //token name
        "token_transfer_params", //token transfer detail
        "hash",
        "block",
        "from",
        "to",
        "gas", //estimate the gas value
        "gasPrice",
        "value",
        "nonce",
        "timestamp"
   }
1) unconfirmed_transaction:
   {
        "address":"transactions": [transaction]
   }
2) confirmed_transactions:
   {
        "address":"transactions": [transaction]
   }

Note:
1) all transactions are listed ordered by nounce.
*/

const initialState = {
    confirmed_transactions: {},
    unconfirmed_transactions: {},
};

function indexOfTransaction(item, arr) {
    if (!arr || !item) {
        return -1;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].hash === item.hash) {
            return i;
        }
    }
    return -1;
}

function indexOfAddress(item, arr) {
    if (!arr || !item) {
        return -1;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].address.toLowerCase() == item.from.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

function handleTransaction(transactions, transaction, replace=false) {
    if (!transactions) {
        transactions = [];
    }
    let index = indexOfTransaction(transaction, transactions);
    if (index > -1) {
        localTransaction = transactions.splice(index, 1)
    }
    if (replace) {
        transactions = transactions.concat(transaction)
    }
    return transactions
}

function syncTransaction(state, transactionInfo, fromServer=false) {
    if (! transactionInfo) return;
    let transaction = transactionInfo.transaction;
    let address = transactionInfo.address;

    if (typeof transaction.blockNumber === 'undefined') return state;
    if (!state.unconfirmed_transactions) {
        state.unconfirmed_transactions = {};
    }
    if (!state.confirmed_transactions) {
        state.confirmed_transactions = {};
    }
    isDone = isConfirmedTransaction(transaction)

    if (isDone) {
        //remove it from unconfirmed
        transactions = handleTransaction(state.unconfirmed_transactions[address], transaction, false)
        state.unconfirmed_transactions[address] = transactions
        //update it in confirmed
        transactions = handleTransaction(state.confirmed_transactions[address], transaction, true)
        state.confirmed_transactions[address] = transactions;
    } else {
        transactions = handleTransaction(state.unconfirmed_transactions[address], transaction, true)
        state.unconfirmed_transactions[address] = transactions
    }
}

export default function (state = initialState, action) {
    const {payload = {}, meta = {}, error} = action;
    const {sequence = {}} = meta;

    if (sequence.type === 'start' || error) {
        return state;
    }

    //Log.log("action: " + action.type + " payload: " + JSON.stringify(payload))

    switch (action.type) {
        case types.SEND_TRANSACTION:
        case types.SEND:
            //Log.log("send: " + JSON.stringify(payload))
            if (payload && sequence.type === 'next') {
                var address = payload.address;
                if (!address) {
                    Log.log("Invalid address" + address);
                    return state;
                }
                var transaction = payload.transaction;
                let transactionInfo = etherutils.preprocessTransaction(payload, false);
                if ((!transactionInfo) || (!transactionInfo.transaction)) {
                    Log.log("wrong transaction info", transactionInfo);
                    return state;
                }
                address = address.toLowerCase();
                /*
                    find the address
                 */
                var unconfirmed_transactions = state.unconfirmed_transactions;
                if (!unconfirmed_transactions) {
                    unconfirmed_transactions = {}
                    unconfirmed_transactions[address] = [].concat(transactionInfo.transaction);
                } else {
                    transactions = unconfirmed_transactions[address];
                    if (!transactions) {
                        unconfirmed_transactions[address] = [].concat(transactionInfo.transaction)
                    } else {
                        unconfirmed_transactions[address] = transactions.concat(transactionInfo.transaction)
                    }
                }
                return {
                    ...state,
                    unconfirmed_transactions: unconfirmed_transactions
                };
            }
            return state;
        case types.SYNC_TX_INFO:
            if (!payload) {
                Log.log("Empty transaction");
                return state;
            }
            let transactionInfo = etherutils.preprocessTransaction(payload, true);
            syncTransaction(state, transactionInfo)
            return Object.assign({}, state);
        case types.GET_TRANSACTION_FROM_STORAGE:
            return {
                ...state,
                ...payload
            };
        case types.UPDATE_TRANSACTION_LIST:
            if (!payload) {
                Log.log("Empty transaction list");
                return state;
            }
            let address = payload.address;
            let token = payload.token;
            if(token==null||typeof(token) =='undefined'){
                state.confirmed_transactions[address] = [];
                state.unconfirmed_transactions[address] = [];
            }else {
                let isToken = Global.ETH_ADDRESS!==token;
                let confirm_transaction = state.confirmed_transactions[address];
                let unconfirm_transaction = state.unconfirmed_transactions[address];
                let new_confirm_transaction = []
                let new_unconfirmed_transactions = []
                if(confirm_transaction){
                    new_confirm_transaction = confirm_transaction.filter((item) => {
                        return isToken? item.to != token : item.type == Constant.TRANSACTION_TYPE_CONTRACT;
                    });
                }
                if(unconfirm_transaction){
                    new_unconfirmed_transactions = unconfirm_transaction.filter((item) => {
                        return isToken? item.to != token : item.type == Constant.TRANSACTION_TYPE_CONTRACT;
                    });
                }
                state.confirmed_transactions[address] = new_confirm_transaction;
                state.unconfirmed_transactions[address] = new_unconfirmed_transactions;

            }
            let transactions = payload.transactions;
            if (address && transactions) {
                transactions.forEach(transaction => {
                    let transactionInfo = etherutils.preprocessTransaction({address: address, transaction: transaction}, true);
                    syncTransaction(state, transactionInfo, true);
                })
            }
            return Object.assign({}, state);
        case types.GET_TRANSACTION_LIST:
            if (!payload) {
                Log.log("Empty transaction list");
                return state;
            }
            address = payload.address;
            transactions = payload.transactions;
            if (address && transactions) {
                transactions.forEach(transaction => {
                    let transactionInfo = etherutils.preprocessTransaction({address: address, transaction: transaction}, true);
                    syncTransaction(state, transactionInfo, true);
                })
            }
            return Object.assign({}, state);
        default:
            return state;
    }
}
