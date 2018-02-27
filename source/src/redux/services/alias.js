import * as utils from "../../libs/utils"
import * as Log from "../../libs/Log";
import config from '../../configs';
import * as request from '../../services/request'

const ALIAS_DATE_EXPIRED = 60*60*24*1; //1 days;
async function _syncAliasData(args) {
    const {dispatch, state, actions, meta} = args;
    const {resolved, rejected} = meta;
    if (!state || !state.alias || !state.alias.name) {
        Log.log("Invalid alias");
        return;
    }
    try {
        var result = [];
        const {alias} = state;
        if (!alias.dataTimestamp || utils.getTimestamp() - alias.dataTimestamp > ALIAS_DATE_EXPIRED) {
            params = {
                uuid:alias.uuid,
                alias: alias.name
            }
            result = await request.get("getAliasData", params);
            if (!result || !result.data) {
                result = [];
            } else {
                result = result.data;
            }
            Log.log("use remote alias data")
        } else {
            Log.log("use local alias data")
            result = alias.data;
        }

        var wallets = state.wallet.wallets;
        Log.log("sync alias:old data");
        Log.log(result);
        Log.log("sync alias:new data");
        Log.log(wallets);
        if (!state.wallet.loaddedFromStorage) {
            Log.log("wait get wallets");
            if(resolved) {
                resolved(null);
            }
            return;
        }
        var newWallets1 = {...wallets};
        var removeWallets = [];
        for (let address of result) {
            if (newWallets1[address]) {
                delete newWallets1[address];
            } else {
                removeWallets = removeWallets.concat(address);
            }
        }
        var newWallets = [];
        for (address in newWallets1) {
            newWallets = newWallets.concat(newWallets1[address]);
        }
        Log.log("newWallets");
        Log.log(newWallets);
        Log.log("removeWallets");
        Log.log(removeWallets);
        if (newWallets) {
            var data = "";
            for (let item of newWallets) {
                data = data + "," + item.address;
            }
            if (data.length > 0) {
                data = data.substring(1);
                await _addAliasData(alias, data);
            }
        }
        if (removeWallets) {
            var data = "";
            for (let item of removeWallets) {
                data = data + "," + item;
            };
            if (data.length > 0) {
                data = data.substring(1);
                await _removeAliasData(alias, data);
            }
        }
        var walletArray = []
        Log.log("set data");
        Log.log(wallets);
        for (i in wallets) {
            Log.log(wallets[i]);
            walletArray = walletArray.concat(wallets[i].address);
        }
        dispatch(actions.setAliasData({
            data: walletArray,
            dataTimestamp: utils.getTimestamp(),
            resolved,
            rejected,
        }));
    } catch (error) {
        Log.log(error);
    }
}

async function _addAliasData(alias, data) {
    //TODO:Limit number of data one call
    Log.log("add alias data");
    if (!data) {
        return;
    }
    Log.log(data);
    params = {
        uuid:alias.uuid,
        alias: alias.name,
        data:data,
    }
    let result = await request.get("addAliasData", params);
}

async function _removeAliasData(alias, data) {
    //TODO:Limit number of data one call
    Log.log("remove " + data);
    if (!data) {
        return;
    }
    params = {
        uuid:alias.uuid,
        alias: alias.name,
        data:data,
    }
    let result = await request.get("removeAliasData", params);
}

export const syncAliasData = (args) => {
    const {dispatch, state, actions, data, meta} = args;
    const {resolved, rejected, loading} = meta;
    _syncAliasData(args).then();
}
