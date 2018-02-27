import * as types from '../constants/ActionTypes';

/*
[{"name":"ILS","value":"3.512","symbol":""},{"name":"BGN","value":"1.6875","symbol":""},{"name":"DKK","value":"6.4223","symbol":""},{"name":"IDR","value":"13518.0","symbol":""},{"name":"GBP","value":"0.76277","symbol":""},{"name":"CAD","value":"1.2729","symbol":""},{"name":"RON","value":"3.9931","symbol":""},{"name":"HUF","value":"269.07","symbol":""},{"name":"JPY","value":"113.49","symbol":""},{"name":"MYR","value":"4.2243","symbol":""},{"name":"SEK","value":"8.3941","symbol":""},{"name":"CHF","value":"0.99922","symbol":""},{"name":"SGD","value":"1.362","symbol":""},{"name":"AUD","value":"1.3023","symbol":""},{"name":"CNY","value":"6.6297","symbol":"\uffe5"},{"name":"KRW","value":"1113.3","symbol":""},{"name":"TRY","value":"3.887","symbol":""},{"name":"NZD","value":"1.443","symbol":""},{"name":"HKD","value":"7.7966","symbol":""},{"name":"THB","value":"33.11","symbol":""},{"name":"EUR","value":"0.86281","symbol":""},{"name":"HRK","value":"6.5047","symbol":""},{"name":"NOK","value":"8.1734","symbol":""},{"name":"RUB","value":"59.29","symbol":""},{"name":"INR","value":"64.987","symbol":""},{"name":"CZK","value":"22.053","symbol":""},{"name":"PHP","value":"51.241","symbol":""},{"name":"BRL","value":"3.2495","symbol":""},{"name":"PLN","value":"3.6532","symbol":""},{"name":"MXN","value":"19.07","symbol":""},{"name":"ZAR","value":"14.186","symbol":""}]
 */
import * as Log from "../../libs/Log"

const initialState = {
    exchanges: {},
};

function syncExchangeRate(state, exchange, fromServer=false) {
    if (! exchange) return;

    state.exchanges[exchange.name] = exchange;
}

export default function (state = initialState, action) {
    const { payload = {}, meta = {}, error } = action;
    const { sequence = {} } = meta;

    if (sequence.type === 'start' || error) {
        return state;
    }

    switch (action.type) {
        case types.EXCHANGE_RATE_SYNC:
            if (!payload) {
                Log.log("Empty exchange list");
                return state;
            }
            payload.forEach(exchange => {
                syncExchangeRate(state, exchange, true);
            })
            return Object.assign({}, state);
        case types.GET_EXCHANGE_RATE_FROM_STORAGE:
            if (!payload) {
                Log.log("Empty exchange list");
                return state;
            }
            return {
                ...state,
                ...payload
            };
        default:
            return state;
    }
}
