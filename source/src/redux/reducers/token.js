import * as types from '../constants/ActionTypes';

/*
    [
    {"name":"Yiya","symbol":"YIYA","unit":"yiya","address":"0x549211427D479443146a426D4679D3Ad0cac7A45","icon":"yiya.io\/tokens\/yiya.png","price":"8.88"},
    {"name":"Ethereum","symbol":"ETH","unit":"ether","address":"","icon":"yiya.io\/tokens\/Ethereum.png","price":"2000.00"}
    ]
 */
import * as Log from "../../libs/Log"
import {updateTokenList} from "../../libs/utils"

const initialState = {
    tokens: {},
};

function syncToken(state, token, fromServer=false) {
    if (! token) return;

    state.tokens[token.address] = token;
}

export default function (state = initialState, action) {
    const { payload = {}, meta = {}, error } = action;
    const { sequence = {} } = meta;

    if (sequence.type === 'start' || error) {
        return state;
    }

    switch (action.type) {
        case types.TOKEN_SYNC:
            if (!payload) {
                Log.log("Empty token list");
                return state;
            }

            let tokens = {};
            payload.forEach(token => {
                if (! token) return;
                tokens[token.address] = token;
            })
            updateTokenList(tokens);
            return {
              ...state,
                tokens
            };
        case types.GET_TOKEN_LIST_FROM_STORAGE:
            if (!payload) {
                Log.log("Empty token list");
                return state;
            }
            updateTokenList(payload.tokens);
            return {
                ...state,
                ...payload
            };
        default:
            return state;
    }
}
