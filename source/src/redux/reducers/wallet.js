import * as types from '../constants/ActionTypes';

/*
    one wallet is composed by:
    1) address: public key
    2) keystore: keystore string

    structures:
    wallet: {
                name: ppp,
                address: xxx,
                keystore: yyy,
                balance: zzz,
                tokens: {xxx:[ppp]
                        }
             }

    wallets: {
                address:wallet
             }
 */
import * as Log from "../../libs/Log"

const initialState = {
    wallets: null,
    cur_wallet: null,
};

export default function (state = initialState, action) {
    const { payload = {}, meta = {}, error } = action;
    const { sequence = {} } = meta;

    if (sequence.type === 'start' || error) {
        return state;
    }
    
    switch (action.type) {
        case types.CREATE_WALLET:
        case types.IMPORT_WALLET:
            if (!payload) {
                return state;
            }
            if (!payload.address) {
                return state;
            }
            /* all saved address should be appended by 0x */
            if (payload.address.indexOf("0x") != 0) {
                payload.address = "0x" + payload.address;
            }
            address = payload.address;
            wallets = state.wallets;
            cur_wallet = {name: payload.name, address: payload.address, balance: 0, isBackup:false ,keystore: payload.keystore};
            if (wallets) {
                newwallet = wallets[address]
                if (newwallet) {
                    wallets[address] = {
                      ...wallets[address],
                      ...cur_wallet
                    };
                } else {
                    wallets[address] = cur_wallet;
                }
            } else {
                wallets = {};
                wallets[address] = cur_wallet;
            }
            return Object.assign({}, state, { wallets: wallets, cur_wallet: cur_wallet});
        case types.CHANGE_WALLET_NAME:
            if (!payload) {
                return state;
            }
            if (!payload.address) {
                return state;
            }
            if (payload.address.indexOf("0x") != 0) {
                payload.address = "0x" + payload.address;
            }
            address = payload.address;
            newName = payload.name;
            wallets = state.wallets;
            cur_wallet = state.cur_wallet;
            if (wallets) {
                wallet = wallets[address];
                if (wallet) {
                    wallets[address] = {
                      ...wallets[address],
                        name: newName
                    }
                }
                if (cur_wallet && cur_wallet.address == address) {
                    cur_wallet.name = newName;
                }
                return Object.assign({}, state, {wallets: wallets, cur_wallet: cur_wallet});
            }
            return state;
            break;
        case types.BACKUP_WALLET:
            if (!payload) {
                return state;
            }
            if (!payload.address) {
                return state;
            }
            if (payload.address.indexOf("0x") != 0) {
                payload.address = "0x" + payload.address;
            }
            address = payload.address;
            isBackup = payload.isBackup;
            wallets = state.wallets;
            cur_wallet = state.cur_wallet;
            if (wallets) {
                wallet = wallets[address];
                if (wallet) {
                    wallets[address] = {
                      ...wallets[address],
                        isBackup: isBackup
                    }
                }
                if (cur_wallet && cur_wallet.address == address) {
                    cur_wallet.isBackup = isBackup;
                }
                return Object.assign({}, state, {wallets: wallets, cur_wallet: cur_wallet});
            }
            return state;
            break;
        case types.GET_WALLET_FROM_STORAGE:
            return {
                ...state,
                ...payload
            };
        case types.GET_BANLANCE:
            if (!payload) {
                return state;
            }
            if (payload.address.indexOf("0x") != 0) {
                payload.address = "0x" + payload.address;
            }
            address = payload.address;
            balance = payload.balance/1e18;
            wallets = state.wallets;
            cur_wallet = state.cur_wallet;
            if (wallets) {
                wallet = wallets[address];
                if (wallet) {
                    wallets[address] = {
                      ...wallets[address],
                        balance: balance
                    }
                }
                if (cur_wallet.address == address) {
                    cur_wallet.balance = balance;
                }
                return Object.assign({}, state, {wallets: wallets, cur_wallet: cur_wallet});
            }
            return state;
        case types.REMOVE_WALLET:
            if (!payload) {
                return state;
            }
            if (payload.address.indexOf("0x") != 0) {
                payload.address = "0x" + payload.address;
            }
            address = payload.address;
            wallets = state.wallets;
            cur_wallet = state.cur_wallet;
            if (wallets) {
                wallet = wallets[address];
                if (wallet) {
                    delete wallets[address];
                }
                if (cur_wallet && cur_wallet.address == address) {
                    cur_wallet = null;
                    for (wallet in wallets) {
                        cur_wallet = wallets[wallet];
                    }
                }
            }
            return Object.assign({}, state, { wallets: wallets, cur_wallet: cur_wallet});
        case types.SWITCH_WALLET:
            if (!payload) {
                return state;
            }
            return {
                ...state,
                cur_wallet: payload
            }
        case types.TOKEN_CONFIG:
            if (!payload) {
                return state;
            }
            let address = payload.address;
            let tokens = payload.tokens;
            let wallets = state.wallets;
            let cur_wallet = state.cur_wallet;

            if (wallets) {
                let wallet = wallets[address];
                if (wallet) {
                    let wallet_tokens = wallet.tokens;
                    let cur_wallet_tokens = cur_wallet.tokens;

                    if (!wallet_tokens) {
                        wallet_tokens = {}
                    }

                    if (!cur_wallet_tokens) {
                        cur_wallet_tokens = {}
                    }

                    if (!wallets[address].tokens) {
                        wallets[address].tokens = {};
                    }
                    //clear
                    wallets[address].tokens={};
                    if (cur_wallet.address === address) {
                        cur_wallet.tokens = {};
                    }

                    let token_len = tokens.length;
                    for (i=0; i<token_len; i++) {
                        wallets[address].tokens[tokens[i]] = {
                            ...wallet_tokens[tokens[i]],
                            address: tokens[i]
                        }

                        if (cur_wallet.address === address) {
                            cur_wallet.tokens[tokens[i]] = {
                              ...cur_wallet_tokens[tokens[i]],
                                address: tokens[i]
                            }
                        }
                    }
                }
                return Object.assign({}, state, { wallets: wallets, cur_wallet: cur_wallet});
            }
            return state;
        case types.TOKEN_ADD:
            if (!payload) {
                return state;
            }
            address = payload.address;
            token_address = payload.token_address;
            wallets = state.wallets;
            cur_wallet = state.cur_wallet;

            if (wallets) {
                let wallet = wallets[address];
                if (wallet) {
                    let wallet_tokens = wallet.tokens;
                    let cur_wallet_tokens = cur_wallet.tokens;

                    if (!wallet_tokens) {
                        wallet_tokens = {};
                    }

                    if (!cur_wallet_tokens) {
                        cur_wallet_tokens = {};
                    }

                    if (!wallets[address].tokens) {
                        wallets[address].tokens = {};
                    }

                    if (!cur_wallet.tokens) {
                        cur_wallet.tokens = {};
                    }
                    
                    if (! wallets[address].tokens[token_address]) {
                        wallets[address].tokens[token_address] = {
                            ...wallet_tokens[token_address],
                            address: token_address
                        }

                        if (cur_wallet.address === address) {
                            cur_wallet.tokens[token_address] = {
                                ...cur_wallet_tokens[token_address],
                                address: token_address
                            }
                        }
                    }
                }
                return Object.assign({}, state, { wallets: wallets, cur_wallet: cur_wallet});
            }
            return state;
        case types.TOKENS_SYNC:
            if (!payload) {
                return state;
            }
            address = payload.address;
            tokens = payload.tokens;
            wallets = state.wallets;
            cur_wallet = state.cur_wallet;

            if (wallets) {
                let wallet = wallets[address];
                if (wallet) {
                    let wallet_tokens = wallet.tokens;
                    let cur_wallet_tokens = cur_wallet.tokens;

                    if (!wallet_tokens) {
                        wallet_tokens = {};
                    }

                    if (!cur_wallet_tokens) {
                        cur_wallet_tokens = {};
                    }

                    if (!wallets[address].tokens) {
                        wallets[address].tokens = {};
                    }

                    if (!cur_wallet.tokens) {
                        cur_wallet.tokens = {};
                    }

                    let token_len = tokens.length;
                    for (i=0; i<token_len; i++) {
                        wallets[address].tokens[tokens[i]] = {
                            ...wallet_tokens[tokens[i]],
                            address: tokens[i]
                        }

                        if (cur_wallet.address === address) {
                            cur_wallet.tokens[tokens[i]] = {
                                ...cur_wallet_tokens[tokens[i]],
                                address: tokens[i]
                            }
                        }
                    }
                }
                return Object.assign({}, state, { wallets: wallets, cur_wallet: cur_wallet});
            }
            return state;
        case types.TOKEN_GET_BALANCE:
            if (!payload) {
                return state;
            }
            if (payload.address.indexOf("0x") != 0) {
                payload.address = "0x" + payload.address;
            }
            address = payload.address;
            token = payload.token;
            balance = payload.balance;
            wallets = state.wallets;
            cur_wallet = state.cur_wallet;
            if (wallets) {
                wallet = wallets[address];
                if (wallet && wallet.tokens) {
                    wallet_token = wallets[address].tokens[token];
                    if (wallet_token) {
                        wallets[address].tokens[token] = {
                            ...wallets[address].tokens[token],
                            balance: balance
                        }
                    }
                }
                if (cur_wallet.address == address) {
                    cur_wallet.tokens[token] = {
                      ...cur_wallet.tokens[token],
                        balance: balance
                    };
                }
                return Object.assign({}, state, {wallets: wallets, cur_wallet: cur_wallet});
            }
            return state;
        default:
            return state;
    }
}
