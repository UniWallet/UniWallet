import React from 'react';
import {Platform} from "react-native";

import getString from "../../translations";
import * as Log from "../../libs/Log";

export const updateBalance = (args) => {
    const {dispatch, state, actions, data, meta} = args;
    const {resolved, rejected, loading} = meta;
    var wallet = state.wallet.cur_wallet;
    if (wallet) {
        Log.log("updateBalance address: " + wallet.address);
        dispatch(actions.getBalance({
            address: wallet.address,
            resolved,
            rejected,
        }));
    }
}

export const getTransactionList = (args) => {
    const {dispatch, state, actions, data, meta} = args;
    const {resolved, rejected, loading} = meta;
    var wallet = state.wallet.cur_wallet;
    var count= 40;
    var offset = 0;
    if(data&&data.count&&data.offset){
        count = data.count;
        offset = data.offset;
    }
    if (wallet) {
        Log.log("wallet address:" + wallet.address);
        dispatch(actions.getTransactionList({address:wallet.address, count:count , offset:offset, resolved, rejected,loading}));
    }
}

var waitTimer = null;
var times = 0;
const MAX_TIMES = 60;
const PERIOD = 1000*2;//2s
export const waitPendingTransaction = (args) => {
    const {dispatch, actions, data} = args;
    if (data && data.address && data.transaction && data.transaction.hash && times < MAX_TIMES) {
        dispatch(actions.syncTxInfo({
            address: data.address,
            hash:data.transaction.hash,
            resolved:(result) => {
                if (result) {
                    Log.log("waitPendingTransaction, done.")
                    clearInterval(waitTimer);
                    waitTimer = undefined;
                }
            },
            rejected:(error) => {
                Log.log("waitPendingTransaction rejected," + error)
            }
        }));
    } else {
        Log.log("Invalid transaction hash or max times, clear timer.")
        clearInterval(waitTimer);
        waitTimer = undefined;
    }
}

export const postSendTransaction = (args) => {
    if (waitTimer) {
        return;
    }
    //TODO:Support multiple hash
    const {dispatch, actions, data} = args;
    if (!data || !data.transaction || !data.transaction.hash) {
        Log.log("postSendTransaction, invalid hash");
        return;
    }
    times = 0;
    waitTimer = setInterval(()=> {
        times++;
        dispatch(actions.callService("waitPendingTransaction", data));
    }, PERIOD);
}
