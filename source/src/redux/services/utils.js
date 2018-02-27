import * as utils from "../../libs/utils"
import * as Log from "../../libs/Log";
import {updateProviderUrl} from "../../libs/web3"
import {updateAPIUrl} from "../../services/request"

var setting = {}
export const onSettingUpdated = (args) => {
    const {dispatch, state, actions, data, meta} = args;
    const {resolved, rejected, loading} = meta;
    if (state.setting.web3url && setting.web3url != state.setting.web3url) {
        updateProviderUrl(state.setting.web3url);
    }
    if (state.setting.apiurl && setting.apiurl != state.setting.apiurl) {
        updateAPIUrl(state.setting.apiurl);
    }
    setting = {...state.setting}
}