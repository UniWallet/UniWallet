import * as App from "../../App"
import * as Log from "../../../libs/Log"
import * as utils from "../../../libs/utils"
import {web3} from "../../../libs/web3"
import * as Constant from "../../../libs/constant"
import {formatBalance} from "../../../libs/etherutils"
import getString from "../../../translations/index";

exports.getWallet = function getWallet(wallet, name) {
    try {
        Log.log("try to get wallet: " + name + " from: " + wallet)
        if (name == null || name == undefined || name.length == 0) return null;

        var mywallets = wallet.wallets;
        if (!mywallets) {
            return null;
        }
        for (var i in mywallets) {
            var wt = mywallets[i];
            if (wt.name === name) {
                return wt;
            }
        }
    } catch (e) {
        Log.log("get wallet error: "+e);
        return null;
    }
}

exports.hasWalletNameReady = function (wallet, name){
    try {
        Log.log("try to get wallet: " + name + " from: " + wallet)
        if (name == null || name == undefined || name.length == 0) return null;

        var mywallets = wallet.wallets;
        if (!mywallets) {
            return false;
        }
        for (var i in mywallets) {
            var wt = mywallets[i];
            if (wt.name === name) {
                return true;
            }
        }
    } catch (e) {
        Log.log("has wallet name ready error: "+e);
        return false;
    }
}

exports.getWallet = function getWallet(wallet, address) {
    try {
        Log.log("try to get wallet: " + name + " from: " + wallet)
        if (address == null || address == undefined || address.length == 0) return null;

        var mywallets = wallet.wallets;
        if (!mywallets) {
            return null;
        }
        for (var i in mywallets) {
            var wt = mywallets[i];
            if (wt.address === address) {
                return wt;
            }
        }
    } catch (e) {
        Log.log("get wallet error: "+e);
        return null;
    }
}

function _transaction_compare(a,b) {
    if (a.timestamp < b.timestamp)
        return 1;
    if (a.timestamp > b.timestamp)
        return -1;
    return 0;
}

export function formatTransactionBalance(transaction, count) {
    if (!transaction) {
        return formatBalance(0, count)
    }
    let value = transaction.value
    if (transaction.type == Constant.TRANSACTION_TYPE_CONTRACT) {
        value = transaction.extra.value;
    }
    if (transaction.decimal) {
        value = value / Math.pow(10, transaction.decimal)
    }
    if (!value) {
        value = 0;
    }
    return formatBalance(value, count);
}

export function getTransactionToAddress(transaction) {
    if (!transaction) {
        return null;
    }
    let address = transaction.to
    if (transaction.type == Constant.TRANSACTION_TYPE_CONTRACT) {
        address = transaction.extra.to;
    }
    return address;
}

function _updateTokenToAndValue(transaction) {
    try {
        method = transaction.extra.method;
        if (method && method === "transfer") {
            transaction.to = transaction.extra.inputs._to;
            transaction.value = transaction.extra.inputs._value;
        }
    } catch (e) {
        Log.log("token transfer param is error: " + e);
    }
    return transaction;
}

exports.getTransactionStatus = function getTransactionStatus(trans) {
    let status = getString("transaction_status_unknown")
    let error = 0;
    try {
        if (trans) {
            let confirmed = 0;
            if (trans.confirmations) {
                confirmed = parseInt(trans.confirmations, 10);
            }
            if (trans.status == 0) {
                error = 1;
                if (confirmed > 0) {
                    if (trans.gas == trans.gasUsed) {
                        status = getString("transaction_status_fail_out_of_gas");
                    } else {
                        status = getString("transaction_status_fail_error");
                    }
                } else {
                    status = getString("transaction_status_fail_pending_timeout");
                }
            }
            if (trans.status == 1) {
                if (confirmed >= 12) {
                    status = getString("transaction_status_success");
                } else {
                    status = getString("transaction_status_waiting_confirm");
                }
            }

            if (! trans.status) {
                if (confirmed == 0) {
                    status = getString("transaction_status_pending");
                } else {
                    if (confirmed < 12) {
                        status = getString("transaction_status_waiting_confirm");
                    } else {
                        if (trans.gas == trans.gasUsed) {
                            status = getString("transaction_status_fail_out_of_gas");
                        } else {
                            status = getString("transaction_status_success");
                        }
                    }
                }
            }
        }
    } catch (e) {
        Log.log("get transaction status error: " + e);
        status = getString("transaction_status_unknown");
    }

    return {
        error: error,
        status: status
    };
}

exports.getTransaction = function getTransaction(trans, address, token_address=null) {
    try {
        Log.log("try to get transaction: " + address + " with address: " + token_address)
        if (address == null || address == undefined || address.length == 0) return null;

        var confirmed = trans.confirmed_transactions;
        var unconfirmed = trans.unconfirmed_transactions;

        /* it's very import to deep copy because the data will be changed soon
           Strange that prop data can be changed. I will check the issue later.
        */
        var confirmed_trans = [];
        var unconfirmed_trans = [];

        if (confirmed && confirmed[address]) {
            confirmed_trans = JSON.parse(JSON.stringify(confirmed[address]))
        }
        if (unconfirmed && unconfirmed[address]) {
            unconfirmed_trans = JSON.parse(JSON.stringify(unconfirmed[address]))
        }

        var all_trans = [];
        var all_trans_temp = unconfirmed_trans.concat(confirmed_trans);
        all_trans_temp = all_trans_temp.sort(_transaction_compare);
        all_trans_length = all_trans_temp.length;
        for (i=0; i<all_trans_length; i++) {
            let transaction = all_trans_temp[i];
            if (transaction && transaction.to) {
                let token_info = utils.getTokenUnitFromAddress(transaction.to.toLowerCase());
                let isToken = transaction.type == Constant.TRANSACTION_TYPE_CONTRACT;
                if (isToken&&!utils.isTokenInfo(token_info)) {
                    continue;
                }
                if (!token_address || (token_info && token_address && token_info.address.toLowerCase() == token_address.toLowerCase())) {
                    all_trans = all_trans.concat(
                        [{
                            ...transaction,
                            unit: token_info.unit,
                            decimal: token_info.decimal,
                        }]
                    );
                }
            }
        }
        Log.log(all_trans)
        return all_trans;
    } catch (e) {
        Log.log("get transaction error: " + e);
        return null;
    }
}


