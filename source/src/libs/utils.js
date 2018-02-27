import moment from 'moment';
import * as Log from "./Log"
import * as storageService from '../services/storage';
import Global from "../components/common/Global";
import getString from "../translations/index";
import * as types from '../redux/constants/ActionTypes';
import I18n, { getLanguages } from 'react-native-i18n';
import * as messageConst from '../redux/constants/Message';
import * as Constant from "./constant"

export const getDateFromUnix = (timestamp, dataFormat) => {
    if(!timestamp) {
        timestamp = 0;
    }
    var date = moment.unix(timestamp).format(dataFormat);
    return date;
}

export const getTimestamp = () => {
    return Math.round(new Date().getTime() / 1000);
}

export const getTimestampInMilliSecond = () => {
    return Math.round(new Date().getTime());
}


export const safeCall = (func, value) => {
    if (func && typeof(eval(func)) == "function") {
        func(value)
    }
}

tokens_info = {};

exports.updateTokenList = function updateTokenList(tokens) {
    tokens_info = tokens;
}

exports.getToken = function getToken(name) {
    return tokens_info[name];
}

exports.isTokenAddress = function isTokenAddress(address) {
    istoken = false;
    for (token in tokens_info) {
        if (tokens_info[token].address.toLowerCase() === address.toLowerCase()) {
            istoken = true;
            break;
        }
    }
    return istoken;
}

exports.isTokenSymbol = function isTokenSymbol(symbol) {
    istoken = false;
    for (token in tokens_info) {
        if (tokens_info[token].symbol === symbol) {
            istoken = true;
            break;
        }
    }
    return istoken;
}

exports.getTokenUnitFromAddress = function getTokenUnitFromAddress(address) {
    result = tokens_info[Global.ETH_ADDRESS];
    for (token in tokens_info) {
        if (tokens_info[token].address.toLowerCase() === address.toLowerCase()) {
            result = tokens_info[token];
            break;
        }
    }
    return result;
}

exports.isSupport = function isSupport(msg) {
    if (msg.type == messageConst.TYPE_NEWTRANSACTION) {
        let transaction = msg.data;
        if (transaction && transaction.to) {
            let isToken = transaction.type == Constant.TRANSACTION_TYPE_CONTRACT;;
            let tokenInfo = getTokenUnitFromAddress(transaction.to)
            if (isToken&&!isTokenInfo(tokenInfo)) {
                return false;
            }
        }
    }
    return true;
}


exports.isTokenInfo = function(token_info) {
    return token_info && token_info.address !== Global.ETH_ADDRESS;
}

exports.getTokenUnitFromName = function getTokenUnitFromName(name) {
    result = tokens_info[Global.ETH_ADDRESS];
    for (token in tokens_info) {
        if (tokens_info[token].name === name) {
            result = tokens_info[token];
            break;
        }
    }
    return result;
}

exports.getTokenUnitFromSymbol = function getTokenUnitFromSymbol(symbol) {
    result = tokens_info[Global.ETH_ADDRESS];
    for (token in tokens_info) {
        if (tokens_info[token].symbol === symbol) {
            result = tokens_info[token];
            break;
        }
    }
    return result;
}

exchanges_info = {};

exports.updateExchangeRate = async function updateExchangeRate() {
    let exchanges = {};
    let exchangelist = await storageService.getItem("exchange");
    if (exchangelist) {
        exchanges = exchangelist.exchanges;
    }
    exchanges_info = exchanges;
}

exports.getExchange = function getExchange(name) {
    if (!name) {
        // zh-CN use the CNY, others uses the USD
        let current_locale = I18n.locale;
        name = Global.DEFAULT_CONCURRENCY;
        if (current_locale != Global.DEFAULT_LOCALE) {
            name = getString('usd');
        }
    }

    result = exchanges_info[Global.DEFAULT_CONCURRENCY];
    for (exchange in exchanges_info) {
        if (exchanges_info[exchange].name === name) {
            result = exchanges_info[exchange];
            break;
        }
    }
    Log.log("get exchange: " + name + " -> " + JSON.stringify(result));
    return result;
}

exchange_rate = {};

exports.updateCurrentExchange = async function updateCurrentExchange() {
    let settings = await storageService.getItem("setting");
    let current = Global.DEFAULT_CONCURRENCY;
    if (settings && settings.exchange) {
        current = settings.exchange;
    }

    for (exchange in exchanges_info) {
        if (exchanges_info[exchange].name === current) {
            exchange_rate = exchanges_info[exchange];
            break;
        }
    }
    Log.log("update exchange: " + JSON.stringify(settings) + " exchange: " + JSON.stringify(exchange_rate));
}

exports.getCurrentExchange = function getCurrentExchange() {
    return exchange_rate;
}


export function isConfirmedTransaction(tran) {
    if (tran.confirmations == 0 && tran.status == 0) {
        //Log.log("Transaction was not mined within 50 blocks")
        return true;
    }
    return tran.confirmations > 12;
}

//pending action, which will be handling by service in store
export async function pushPendingAction(actions, action, data) {
    if (!actions || !action || !data) {
        Log.log("add pending action error - action: " + action + " data: " + data);
        return;
    }

    let address = data.address;
    if (address) {
        address = address.toLowerCase();
    }

    let token_address = data.token_address;
    if (token_address) {
        token_address = token_address.toLowerCase();
    }
    if (action === types.PENDING_TOKEN_ADD) {
        actions.addToken({address:address, token_address:token_address});
        actions.getTokenBalance({address:address, token_address:token_address})
    }
}

export async function popPendingAction() {

}

export function friendlyTime(dateTimeStamp) {
    var minute = 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    var now = getTimestamp();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        Log.log("friendlytime is before: " + now + " -> " + dateTimeStamp + " diff: " + diffValue);
        result = getString("before_now");
        return result;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
        result = getDateFromUnix(dateTimeStamp, "YYYY/MM/DD")
        // result = "" + parseInt(monthC) + "月前";
    }
    // else if (weekC >= 1) {
    //     result = "" + parseInt(weekC) + "周前";
    // }
    else if (dayC >= 1) {
        result = "" + parseInt(dayC) + getString("before_days");
    }
    else if (hourC >= 1) {
        result = "" + parseInt(hourC) + getString("before_hours");
    }
    else if (minC >= 1) {
        result = "" + parseInt(minC) + getString("before_minutes");
    } else
        result = getString("before_now");
    return result;
}

export function getExchangeFromCurrentLocale() {
    //update exchange unit
    // zh-CN use the CNY, others uses the USD
    let current_locale = I18n.locale;
    let exchange = Global.DEFAULT_CONCURRENCY;
    if (current_locale != Global.DEFAULT_LOCALE) {
        exchange = getString('usd');
    }

    return exchange;
}

export function fixFlatListData(data) {
    if (!data) {
        return data;
    }
    data.forEach((item, i) => {
        item.key = i + 1;
    });
    return data;
}