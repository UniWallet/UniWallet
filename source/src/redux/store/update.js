import * as walletAction from '../actions/wallet';
import * as transactionAction from '../actions/transaction';
import * as Log from "../../libs/Log"
import * as utils from "../../libs/utils"
import * as types from '../constants/ActionTypes';
import actions from "../actions/index"
import * as Constant from "../../libs/constant"

var startUpdate;
const defaultIntervalTime = 1 * 30 * 1000; //update every 30s

function isPromise(val) {
    return val && typeof val.then === 'function';
}

function isResolved(action) {
    const { meta={}, error, payload } = action;
    const { sequence,} = meta;

    if (!isPromise(payload) && !error && (!sequence || sequence.type == "next")) {
        return true;
    }
    return false;
}

export default ({dispatch, getState}) => next => action => {
    const {wallet, transaction} = getState();
    const {unconfirmed_transactions} = transaction;
    const {meta = {}, payload} = action;

    var hasUnfirmedTransaction = false;
    if (action.type === 'UPDATE') {
        if (unconfirmed_transactions) {
            if (typeof startUpdate === 'undefined') {
                dispatch({
                    type: 'START_UPDATE'
                });
            }
            for (address in unconfirmed_transactions) {
                transactions = unconfirmed_transactions[address];
                if (!transactions) {
                    continue;
                }
                transactions.forEach(transaction => {
                    Log.log("update transaction: " + JSON.stringify(transaction));
                    if (transaction) {
                        hasUnfirmedTransaction = true;
                        dispatch(transactionAction.syncTxInfo({address: address, hash: transaction.hash}));
                    }
                });
            }
        }
        if (!hasUnfirmedTransaction) {
            Log.log("update done.")
            clearInterval(startUpdate);
            startUpdate = undefined;
        }
    }

    if (action.type === 'SYNC_TX_INFO') {
        const { meta={}, error, payload } = action;
        const { sequence,} = meta;
        if (payload && !error && payload.from && payload.to) {
            /* change the balance if address is in our wallet */
            Log.log("-> sync tx balance");
            if (payload.type == Constant.TRANSACTION_TYPE_CONTRACT) {
                token_address = payload.to.toLowerCase();
                Log.log("get token balance from: " + payload.from.toLowerCase());
                token_info = utils.getTokenUnitFromAddress(token_address);
                dispatch(walletAction.getTokenBalance({
                    token_symbol: token_info.symbol,
                    token_address: token_info.address,
                    address: payload.from.toLowerCase()
                }));
                if (payload.extra.to) {
                    Log.log("get token balance to: " + payload.extra.to.toLowerCase());
                    dispatch(walletAction.getTokenBalance({
                        token_symbol: token_info.symbol,
                        token_address: token_info.address,
                        address: payload.extra.to.toLowerCase()
                    }));
                } else {
                    Log.log("Invalid 'to' address of contract");
                }
            } else {
                if (wallet.wallets[payload.from.toLowerCase()]) {
                    Log.log("get balance from");
                    dispatch(walletAction.getBalance({address: payload.from.toLowerCase()}));
                }
                if (wallet.wallets[payload.to.toLowerCase()]) {
                    Log.log("get balance to");
                    dispatch(walletAction.getBalance({address: payload.to.toLowerCase()}));
                }
            }
        }
    }

    if (action.type === 'START_UPDATE') {
        if (typeof startUpdate === 'undefined') {
            startUpdate = setInterval(()=> {
                dispatch({
                    type: 'UPDATE'
                });
            }, defaultIntervalTime);
            dispatch({
                type: 'UPDATE'
            });
        }
    }
    next(action);

    actionResolved = isResolved(action);

    if ((action.type === types.GET_WALLET_FROM_STORAGE
            || action.type === types.GET_ALIAS_FROM_STORAGE
            || action.type === types.SET_ALIAS
            || action.type === types.CREATE_WALLET
            || action.type === types.IMPORT_WALLET
            || action.type === types.REMOVE_WALLET)
        && actionResolved) {
        Log.log("found related action")
        Log.log(action);
        dispatch(actions.callService("syncAliasData"));
    }

    if (action.type === types.ADD_MESSAGE && actionResolved) {
        Log.log("found message related action")
        dispatch(actions.callService("processNewMessage"));
    }

    if ((action.type === types.UPDATE_SETTING || action.type === types.GET_SETTING_FROM_STORAGE) && actionResolved) {
        Log.log("found setting related action")
        dispatch(actions.callService("onSettingUpdated"));
    }

    if (action.type == types.SEND_TRANSACTION && actionResolved) {
        dispatch(actions.callService("postSendTransaction", payload));
    }
}
