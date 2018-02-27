import qora from 'qora-core';
import * as types from '../constants/ActionTypes';
import * as importTypes from '../constants/WalletImportType';

import { createAction } from 'redux-actions';
import * as storage from '../../services/storage';
import * as transactionService from '../../services/transaction';
import * as tokenService from '../../services/token';

import * as etherutils from "../../libs/etherutils"
import * as Log from "../../libs/Log"

var NativeAPI = require('react-native').NativeModules.YiYaNativeAPI;
const USING_ETH_UTILS = false;

export const getWalletFromStorage = createAction(types.GET_WALLET_FROM_STORAGE, ()=> {
    return storage.getItem('wallet')
      .then(data=> {
          if (!data || !data.wallets) {
              Log.log("no wallets data")
          }
          return {...data, loaddedFromStorage:true};
      });
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected
    }
});

export const createWallet = createAction(types.CREATE_WALLET, async ({name, pwd})=> {
    var keystore = await NativeAPI.generateV3KeyStore(pwd);
    return {
        name: name,
        address: keystore.address,
        keystore: JSON.parse(keystore.json)
    };
}, ({resolved, rejected, loading})=> {
    return {
        sync:"wallet",
        loading,
        resolved,
        rejected
    }
});

export const changeWalletName = createAction(types.CHANGE_WALLET_NAME,  async ({name, address})=> {
    return {
        name: name,
        address: address,
    };
}, ({resolved, rejected, loading})=> {
    return {
        sync:"wallet",
        loading,
        resolved,
        rejected
    }
});
export const setWalletBackup = createAction(types.BACKUP_WALLET,  async ({isBackup, address})=> {
    return {
        isBackup: isBackup,
        address: address,
    };
}, ({resolved, rejected, loading})=> {
    return {
        sync:"wallet",
        loading,
        resolved,
        rejected
    }
});

export const removeWallet = createAction(types.REMOVE_WALLET, async ({wallet})=> {
    return {
        ...wallet
    };
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        sync:"wallet",
        resolved,
        rejected
    }
});

export const switchWallet = createAction(types.SWITCH_WALLET, async ({wallet})=> {
    return {
        ...wallet
    };
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        sync:"wallet",
        resolved,
        rejected
    }
});

export const configToken = createAction(types.TOKEN_CONFIG, async ({address, tokens})=> {
    return {
        address:address,
        tokens:tokens
    };
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        sync:"wallet",
        resolved,
        rejected
    }
});

export const addToken = createAction(types.TOKEN_ADD, async ({address, token_address})=> {
    return {
        address:address,
        token_address: token_address
    };
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        sync:"wallet",
        resolved,
        rejected
    }
});


export const getBalance = createAction(types.GET_BANLANCE, async ({address})=> {
    var balance = await transactionService.getBalanceByAddress(address);
    return {
        address: address,
        balance: balance
    };
}, ({address, type, resolved, rejected, loading})=> {
    return {
        loading,
        sync: 'wallet',
        address: address,
        type: type,
        resolved,
        rejected
    }
});

export const getTokenBalance = createAction(types.TOKEN_GET_BALANCE, async ({token_symbol, token_address, address})=> {
    var balance = await transactionService.getTokenBalanceByAddress(token_symbol, token_address, address);
    return {
        address: address,
        token: token_address,
        balance: balance
    };
}, ({address, type, resolved, rejected, loading})=> {
    return {
        loading,
        sync: 'wallet',
        address: address,
        type: type,
        resolved,
        rejected
    }
});

//importWallet is almost same with createWallet
export const importWallet = createAction(types.IMPORT_WALLET, async ({input, pwd, type, name})=> {
    if (type === importTypes.IMPORT_KEY_STORE) {
        inputObj = JSON.parse(input);
        if (USING_ETH_UTILS) {
            data = etherutils.decryptKeyStore(inputObj, pwd);
        } else {
            Log.log(input);
            data = await NativeAPI.decryptV3Keystore(input, pwd);
        }
        if (data == null) {
            return {error:"empty data"};
        }
        address = data.address
        if (address.indexOf("0x") >= 0) {
            address = address.substring(2).toLowerCase();
        }
        if (inputObj.address !== address) {
            console.log("input address:" + inputObj.address + " parsed address:" + address)
            return {error:"invalid wallet, please check password or keystore file"};
        }
        return {
            address:address,
            keystore:inputObj,
            name:name,
        }
    } else if (type === importTypes.IMPORT_PRIVATE_KEY) {
        if (USING_ETH_UTILS) {
            data = etherutils.encryptPrivateKey(input, pwd);
        } else {
            data = await NativeAPI.generateV3KeyStoreFromPriviateKey(input, pwd);
            if(data) {
                data = JSON.parse(data.json);
            }
        }
        if (data == null) {
            return {error:"empty data"};
        }

        return {
            address:data.address,
            keystore:data,
            name:name,
        }
    } else {
        data = array();
        data.address = ""
    }
    return {
        name: name,
        address: data.address,
    }
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        sync:"wallet",
        resolved,
        rejected
    }
});


export const encryptWallet = createAction(types.ENCRYPT_WALLET, async ({pwd, wallet})=> {
    return qora.core.encrypt(JSON.stringify(wallet), pwd);
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        sync:'wallet',
        resolved,
        rejected
    }
});

export const decryptWallet = createAction(types.DECRYPTE_WALLET, async ({wallet, pwd})=> {
    var privatekey = await NativeAPI.decryptV3Keystore(wallet, pwd);

    return {
        privatekey:privatekey
    };
    }, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected
    }
});

export const lock = createAction(types.LOCK);

export const update = (type)=> {
    return {
        type: types.UPDATE,
        meta: {
            type
        }
    }
};

export const startUpdate = createAction(types.START_UPDATE);

export const getUnconfirmedTransactionList = createAction(types.GET_UNCONFIRMED_TRANSACTION_LIST, transactionService.getUnconfirmedTransactionList);


export const syncTokens = createAction(types.TOKENS_SYNC, async ({address})=> {
    let tokens = await tokenService.getTokens(address);
    return {
        address: address,
        tokens: tokens,
    };
}, ({resolved, rejected})=> {
    return {
        sync: 'wallet',
        resolved,
        rejected
    }
});